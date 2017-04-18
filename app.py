import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options
import logging
import os, json, sys

from fileExtractor import bookSearchByAuthor, bookSearchByTitle, bookFileExtract

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', filename='books_access.log')
savedFileOnMemory = []


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html', messages=None)


class AuthorHandler(tornado.web.RequestHandler):
    def get(self):
        if self.get_argument('name'):
            self.write(json.dumps(bookSearchByAuthor(self.get_argument('name'), int(self.get_argument('skip')))))

    def write_error(self, status_code, **kwargs):
        self.write("Ты ошибся, парень.  %d error." % status_code)


class BookHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(json.dumps(bookSearchByTitle(self.get_argument('title'), int(self.get_argument('skip')))))

    def write_error(self, status_code, **kwargs):
        self.write("Ты ошибся, парень.  %d error." % status_code)


class DownloadHandler(tornado.web.RequestHandler):
    def get(self, fileID):
        self.add_header('Cache-Control', 'no-cache')
        name, data = bookFileExtract(fileID)
        if savedFileOnMemory: savedFileOnMemory.pop()
        savedFileOnMemory.append(data)
        self.redirect('/content/' + name)


class ContentHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        self.add_header('Content-type', 'application/octet-stream')
        self.write(savedFileOnMemory[0])


class Application(tornado.web.Application):
    def __init__(self):
        base_dir = os.path.dirname(__file__)
        handlers = [
            (r'/', MainHandler),
            (r'/author', AuthorHandler),
            (r'/book', BookHandler),
            (r'/download/(\d+)', DownloadHandler),
            (r'/content/(.*)', ContentHandler)]

        settings = dict(
            debug=False,
            template_path=os.path.join(base_dir, 'templates'),
            static_path=os.path.join(base_dir, 'static')
        )
        tornado.web.Application.__init__(self, handlers, **settings)


application = Application()

try:
    if __name__ == "__main__":
        tornado.options.parse_command_line()
        server = tornado.httpserver.HTTPServer(application)
        server.bind(22223)
        server.start(1)
        tornado.ioloop.IOLoop.instance().start()
except KeyboardInterrupt:
    sys.exit(0)

