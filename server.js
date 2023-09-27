// Import required modules
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Check if the request method is GET
  if (req.method === 'GET') {
    // Parse the URL to determine the API version and endpoint
    const urlParts = req.url.split('/');
    const apiVersion = urlParts[2]; // Assuming the version is part of the URL (e.g., /api/v1/users)
    
    if (apiVersion === 'v1' && urlParts[3] === 'users') {
      // Read user data from a file using fs and path modules
      fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
        if (err) {
          // Handle file read error
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }

        try {
          // Convert data to JSON format
          const users = JSON.parse(data);

          // Parse query parameters for pagination
          const queryParams = new URLSearchParams(req.url.split('?')[1]);
          const page = parseInt(queryParams.get('page')) || 1; // Default to page 1
          const pageSize = parseInt(queryParams.get('pageSize')) || 10; // Default page size

          // Calculate the starting and ending index for the current page
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;

          // Slice the users array to get the current page's data
          const paginatedUsers = users.slice(startIndex, endIndex);

          // Respond with the paginated user data for API version 1
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(paginatedUsers));
        } catch (error) {
          // Handle JSON parse error
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error parsing user data');
        }
      });
    } else if (apiVersion === 'v2' && urlParts[3] === 'users') {
      // Handle API version 2 here (if needed)
      // You can create a new route handler for version 2 or add additional logic as required.
      // Example: /api/v2/users
    } else {
      // Invalid API version or endpoint
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } else {
    // Unsupported HTTP method
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

server.listen(3000, () => {
  console.log('Server running on <http://localhost:3000/>');
});
