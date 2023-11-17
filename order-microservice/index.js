const express = require("express");
const axios = require("axios");
const app = express();

// Define a route to purchase a book
app.post("/purchase/:itemNumber", async (req, res) => {
  const itemNumber = req.params.itemNumber;
  res.send("Purchase successful!");
});

// Start the server
app.listen(3002, () => {
  console.log("Server is listening on port 3002");
});
