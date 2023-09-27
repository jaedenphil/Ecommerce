const http = require('http');
const { handleApiRequest } = require('./server');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    // Forward API requests to the API module
    handleApiRequest(req, res);
  } else {
    // Handle non-API requests
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Jaedens clothing brand');
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on <http://localhost>:${PORT}`);
});
