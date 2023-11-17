const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();

// Connect to the SQLite database
const db = new sqlite3.Database("bookstore.db");

// Define a route to search for books on a given topic
app.get("/search/:topic", async (req, res) => {
  const topic = req.params.topic;
  const statement = "SELECT * FROM books WHERE topic = ?";

  const books = await db.all(statement, topic, (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json(rows);
  });
});

// Start the server
app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
