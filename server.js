const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const express = require('express');

const app = express();
const server = http.createServer(app);

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

// Serve the React app from the "build" directory
app.use(express.static(path.join(__dirname, 'my-react-app/build')));

// Define a route for your API
app.get('/api/v1/users', async (req, res) => {
  // Forward API requests to the handleApiRequest function
  await handleApiRequest(req, res);
});

// Define a route for the root (React app)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-react-app/build', 'index.html'));
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});
