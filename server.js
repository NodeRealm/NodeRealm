const http = require('http');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'data', 'events.json');
if (!fs.existsSync(dataFile)) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify({ birthdays: [], dueDates: [], appointments: [] }, null, 2));
}

const serveStatic = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && (url === '/' || url === '/index.html')) {
    serveStatic(res, path.join(__dirname, 'public', 'index.html'));
  } else if (method === 'GET' && url.startsWith('/public/')) {
    serveStatic(res, path.join(__dirname, url));
  } else if (method === 'GET' && url === '/events') {
    fs.readFile(dataFile, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (method === 'POST' && url === '/events') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const event = JSON.parse(body);
        const events = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        if (event.type === 'birthday') {
          events.birthdays.push(event);
        } else if (event.type === 'dueDate') {
          events.dueDates.push(event);
        } else if (event.type === 'appointment') {
          events.appointments.push(event);
        } else {
          throw new Error('invalid type');
        }
        fs.writeFileSync(dataFile, JSON.stringify(events, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid data' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
