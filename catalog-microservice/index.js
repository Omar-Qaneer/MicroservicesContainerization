const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();

// Connect to the SQLite database
const db = new sqlite3.Database("bookstore.db");
const db2 = new sqlite3.Database("../catalog-2-microservice/bookstore.db");

// Define a route to search for books on a given topic
app.get("/search/:topic", async (req, res) => {
  const topic = req.params.topic;
  const statement = "SELECT itemNumber, title FROM books WHERE topic = ?";

  const books = await db.all(statement, topic, (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json(rows);
  });
});

// Define a route to get information about a specific book
app.get("/info/:id", async (req, res) => {
  const subject = req.params.subject;
  const statement =
    "SELECT title, quantity, price FROM books WHERE itemNumber = ?";
  const id = req.params.id;

  const books = await db.all(statement, id, (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    if (!rows.length) {
      console.log("This Item number doesn't exisit in the stock !");
      res.status(400).send("This Item number doesn't exisit in the stock !");
      return;
    }
    console.log(rows);
    res.json(rows);
  });
});

// Define a route to update the quantity of a book
app.put("/update-quantity/:id/:quantity", async (req, res) => {
  const id = req.params.id;
  const quantity = req.params.quantity;
  console.log(quantity);

  await db.run("UPDATE books SET quantity = ? WHERE itemNumber = ?", [
    quantity,
    id,
  ]);

  await db2.run("UPDATE books SET quantity = ? WHERE itemNumber = ?", [
    quantity,
    id,
  ]);

  res.sendStatus(200);
});

// Start the server
app.listen(3001, () => {
  console.log("Server is listening on port 3001 - catalog 1 server");
});
