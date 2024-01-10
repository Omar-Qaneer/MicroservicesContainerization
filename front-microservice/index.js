const express = require("express");
const axios = require("axios");

const app = express();

const NodeCache = require("node-cache");
const myCache = new NodeCache();

var lastCatalogServerUsed = 1;
var lastOrderServerUsed = 1;

// Define a route to forward all requests to the catalog or order server
app.all("*", async (req, res) => {
  const startOfUrl = req.originalUrl;

  // Forward the request to the appropriate server
  if (startOfUrl.startsWith("/search") || startOfUrl.startsWith("/info")) {
    // Send the response from the server back to the client
    var serverUrl = "";
    if (lastCatalogServerUsed === 1) {
      serverUrl = "http://localhost:3004";
      lastCatalogServerUsed = 2;
    } else {
      serverUrl = "http://localhost:3001";
      lastCatalogServerUsed = 1;
    }
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

    if (startOfUrl.startsWith("/search")) {
      // Split the string based on "/"
      const parts = req.originalUrl.split("/");

      // The last part should contain the title of the book
      const title = parts[parts.length - 1];

      console.log(title);

      const cachedBook = myCache.get(`book:${title}`);

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
            myCache.set(`book:${title}`, book, 300); // Cache for 5 minutes
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  } else {
    // Forward request to Order Server & get the response
    var serverUrl = "";
    if (lastOrderServerUsed === 1) {
      serverUrl = "http://localhost:3003";
      lastOrderServerUsed = 2;
    } else {
      serverUrl = "http://localhost:3002";
      lastOrderServerUsed = 1;
    }
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
  console.log("Server is listening on port 3000 - front server");
});
