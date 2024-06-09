//Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');
const comments = [];
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        return res.end('404 Not Found');
      }
      res.end(data);
    });
  } else if (pathname === '/comment') {
    if (req.method === 'POST') {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        const comment = qs.parse(data);
        comments.push(comment);
        res.writeHead(302, {
          Location: '/index.html'
        });
        res.end();
      });
    } else if (req.method === 'GET') {
      res.end(JSON.stringify(comments));
    }
  } else {
    res.end('404 Not Found');
  }
});
server.listen(3000, () => {
  console.log('Server is running at http://