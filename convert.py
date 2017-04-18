import os
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.books
collection = db['fb2']


for fil in os.listdir('/tmp/12'):
    with open('/tmp/12/' + fil, 'r') as f:
        read_data = f.read()
    f.close()
    for i in read_data.split('\n'):
        if i:
            author, genre, title, series, serno, file, size, libid, delet, ext, date, lang, librate, keywords = i.split('\x04')[:-1]
            collection.insert({'archive_name': fil.replace('inp', 'zip'), 'author': author, 'genre': genre, 'title': title,
                               'series': series, 'serno': serno, 'file': file, 'size': size, 'libid': libid, 'delet': delet,
                               'ext': ext, 'date': date, 'lang': lang, 'librate': librate, 'keywords': keywords})
