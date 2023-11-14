const express = require("express");
const request = require("request");

const app = express();

// Define a route to forward all requests to the catalog or order server
app.all("*", async (req, res) => {
  const serverUrl =
    req.originalUrl.startsWith("/search") || req.originalUrl.startsWith("/info")
      ? "http://CATALOG_WEBSERVICE_IP"
      : "http://ORDER_WEBSERVICE_IP";

  // Forward the request to the appropriate server
  const response = await request({
    method: req.method,
    url: serverUrl + req.originalUrl,
    body: req.body,
  });

  // Send the response from the server back to the client
  res.send(response.body);
});

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
