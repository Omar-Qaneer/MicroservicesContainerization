const express = require("express");
const axios = require("axios");

const app = express();

const NodeCache = require("node-cache");
const myCache = new NodeCache();

// Define a route to forward all requests to the catalog or order server
app.all("*", async (req, res) => {
  const startOfUrl = req.originalUrl;

  // Forward the request to the appropriate server
  if (startOfUrl.startsWith("/search") || startOfUrl.startsWith("/info")) {
    // Send the response from the server back to the client
    const serverUrl = "http://localhost:3001";
    console.log(serverUrl);
    console.log(req.originalUrl);

    if (startOfUrl.startsWith("/info")) {
      // Using regular expression to extract the id
      const extractedId = req.originalUrl.match(/\d+/);
      const id = extractedId[0];

      const cachedBook = myCache.get(`book:${id}`);

      if (cachedBook) {
        res.json(cachedBook);
        console.log("Inside Cache");
      } else {
        // Fetch book data from backend
        axios
          .get(serverUrl + req.originalUrl)
          .then((response) => {
            res.json(response.data);
            var book = response.data;
            myCache.set(`book:${id}`, book, 300); // Cache for 5 minutes
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  } else {
    // Forward request to Order Server & get the response
    const serverUrl = "http://localhost:3002";
    console.log(serverUrl);
    console.log(req.originalUrl);

    axios
      .post(serverUrl + req.originalUrl)
      .then(async (response) => {
        res.json(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
