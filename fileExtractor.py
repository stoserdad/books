from pymongo import MongoClient
import zipfile
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


client = MongoClient('localhost', 27017, connect=False)
db = client.books
collection = db['fb2']


def bookFileExtract(file):
    result = collection.find_one({'file': file}, {'_id': 0})
    name = result['author'].replace(':', '').replace(',', '_') + '-' + result['title'].replace(' ', '_') + '.' + result['ext']
    if zipfile.is_zipfile('/home/bender/data/' + result['archive_name']):
        zf = zipfile.ZipFile('/home/bender/data/' + result['archive_name'])
        data = zf.read(result['file'] + '.' + result['ext'])
    return name, data


def bookFileExtractToFile(file):
    result = collection.find_one({'file': file}, {'_id': 0})
    name = result['author'].replace(':', '').replace(',', '_') + '-' + result['title'].replace(' ', '_') + '.' + result['ext']
    if zipfile.is_zipfile('/home/bender/data/' + result['archive_name']):
        zf = zipfile.ZipFile('/home/bender/data/' + result['archive_name'])
        data = zf.read(result['file'] + '.' + result['ext'])
        fileToWrite = open('/tmp/' + name, 'w')
        fileToWrite.write(data)
        fileToWrite.close()
    return name, '/tmp/' + name


def bookSearchByAuthor(authorName, skipRow, limitRow=10):
    rawAuthorName = authorName
    if authorName.strip():
        authorName = authorName.split(' ')
        pattern = '{"$and": ['
        for chunk in authorName:
            if chunk:
                pattern += '{"author": {"$regex": ' + '"' + chunk + '"' + ', "$options": "-i"}},'
        pattern = pattern[:-1]
        pattern += '], "$text": {"$search": ' + '"' + rawAuthorName.strip() + '"' + '}}'
        result = []
        resultGetDB = collection.find(json.loads(pattern), {'_id': 0}).skip(skipRow).limit(limitRow)
        for iter in resultGetDB:
            for res in iter['author'].split(':')[:1]:
                    author = res
                    result.append(dict(author=author.replace(',', ' '), title=iter['title'], filename=iter['file']))
        logging.info('String to find: ' + '"' + rawAuthorName + '"' + '; Found: ' + str(resultGetDB.count()))
        return result, resultGetDB.count()


def bookSearchByTitle(titleName, skipRow, limitRow=10):
    result = []
    if titleName.strip():
        resultGetDB = collection.find({'$text': {'$search': '"' + titleName + '"'}}, {'_id': 0}).skip(skipRow).limit(limitRow)
        for i in resultGetDB:
            result.append(dict(title=i['title'], author=i['author'].replace(',', ' ').replace(':', ''), filename=i['file']))
        logging.info('String to find: ' + '"' + titleName + '"' + '; Found: ' + str(resultGetDB.count()))
        return result, resultGetDB.count()

