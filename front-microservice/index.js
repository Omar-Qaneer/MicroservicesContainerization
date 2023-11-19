const express = require("express");
const axios = require("axios");

const app = express();

// Define a route to forward all requests to the catalog or order server
app.all("*", async (req, res) => {
  const startOfUrl = req.originalUrl;

  // Forward the request to the appropriate server
  if (startOfUrl.startsWith("/search") || startOfUrl.startsWith("/info")) {
    // Send the response from the server back to the client
    const serverUrl = "http://localhost:3001";
    console.log(serverUrl);
    console.log(req.originalUrl);

    axios
      .get(serverUrl + req.originalUrl)
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
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
