const express = require("express");
const axios = require("axios");
const app = express();

// Define a route to purchase a book
app.post("/purchase/:itemNumber", async (req, res) => {
  const itemNumber = req.params.itemNumber;

  // Check if the book is in stock
  axios
    .get(`http://localhost:3001/info/${itemNumber}`)
    .then(async (response1) => {
      const bookInfo = response1.data;
      if (response1.status !== 200) {
        res.status(400).send("Failed to get book info.");
        return;
      }
      console.log(bookInfo[0].quantity);

      if (bookInfo.quantity <= 0) {
        res.status(400).send("Book out of stock.");
        return;
      }
      // Decrement the book's quantity
      return axios.put(
        `http://localhost:3001/update-quantity/${itemNumber}/${
          bookInfo[0].quantity - 1
        }`
      );
    })
    .then((response2) => {
      console.log(response2.status);
    })
    .catch((err) => {
      console.error(err);
    });

  res.send("Purchase successful!");
});

// Start the server
app.listen(3003, () => {
  console.log("Server is listening on port 3003 - order 2 server");
});
