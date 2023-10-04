// Import required modules
const http = require('http');
const fs = require('fs').promises; // Use fs.promises for Promises
const path = require('path');

// Define a function to handle API requests
const handleApiRequest = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Parse the URL to determine the API version and endpoint
      const urlParts = req.url.split('/');
      const apiVersion = urlParts[2];

      if (apiVersion === 'v1' && urlParts[3] === 'users') {
        // Read user data from a file using Promises and async/await
        const data = await fs.readFile(path.join(__dirname, 'users.json'), 'utf8');
        const users = JSON.parse(data);

        // Parse query parameters for pagination
        const queryParams = new URLSearchParams(req.url.split('?')[1]);
        const page = parseInt(queryParams.get('page')) || 1;
        const pageSize = parseInt(queryParams.get('pageSize')) || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = users.slice(startIndex, endIndex);

        // Respond with the paginated user data for API version 1
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(paginatedUsers));
      } else {
        // Handle API version or endpoint not found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    } else {
      // Handle unsupported HTTP method
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
    }
  } catch (error) {
    // Handle errors, log them, and send an internal server error response
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
};

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    // Forward API requests to the handleApiRequest function
    await handleApiRequest(req, res);
  } else {
    // Handle non-API requests
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Jaedens clothing brand');
  }
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on <http://localhost:3000/>');
});

