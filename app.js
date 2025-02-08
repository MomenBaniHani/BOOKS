const express = require("express");
const mysql = require("mysql2");
const app = express();
app.use(express.json());

//Mysql Conncetion/////first step
const conncetion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root12345",
  database: "library",
});

conncetion.connect((err) => {
  if (err) {
    console.log("error connection to mySQL: ", err);
  }
});
//add new book
app.post("/books", (req, res) => {
  const { id, name, title } = req.body; //
  //build query
  const query = "insert into books (id,name,title) values(?,?,?)";
  conncetion.query(query, [id, name, title], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "error adding new book", details: err.message });
    }
    res.status(201).json({ message: "book has been added" });
  });
});
//get all books
app.get("/books", (req, res) => {
  const query = "select * from books";
  conncetion.query(query, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ err: "no book found to retrieve", details: err.message });
    }
    res.json(result);
  });
});

//get book by id
app.get("/books/:id", (req, res) => {
  const query = "SELECT * FROM books WHERE id = ?"; //packet
  conncetion.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ err: "Error retrieve book", details: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ result: "not found" });
    }
    res.json(result[0]);
  });
});

//ubdate book by id
app.put("/books/:id", (req, res) => {
  const { name, title } = req.body;
  const query = "UPDATE books SET name =? , title = ? WHERE id = ?"; //packet
  conncetion.query(query, [name, title, req.params.id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ err: "can not be update the book", details: err.message });
    }
    if (result.affectedRows === 0) {
      //كم روو عمل عليه تعديل

      return res.status(404).json({ Message: "not found the book to update" });
    }
    res.status(200).json({ message: "book has been updated" });
  });
});
//delete by id
app.delete("/books/:id", (req, res) => {
  const query = "DELETE FROM books WHERE id = ?";
  conncetion.query(query, [req.params.id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ err: "cannot delete the book", details: err.message });
    }
    if (result.affectedRows === 0) {
      //كم روو عمل عليه تعديل

      return res.status(404).json({ Message: "not found the book to delete" });
    }
    res.status(200).json({ message: "book has been delete" });
  });
});

// Update translation by book ID
app.patch("/books/:id/translation", (req, res) => {
  const { language } = req.body; //???????????????????????????????
  if (!language || typeof language != "string") {
    return res.status(400).json({ error: "missing language" });
  }
  const query =
    "UPDATE books SET title = CONCAT(title, ' - (', ?, ')') WHERE id = ?";

  conncetion.query(query, [language, req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error updating translation", details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book translation has been updated" });
  });
});

//get bookshops by id
app.get("/bookshop/id/:id", (req, res) => {
  const query = "SELECT * FROM bookshop WHERE shop_id = ?"; //packet
  conncetion.query(query, [req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ err: "Error retrieve bookshop", details: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ result: "BookShop not found" });
    }
    res.json(result[0]);
  });
});

//get cities
app.get("/cities", (req, res) => {
  const query = "SELECT  city FROM bookshop"; //DISTINCT no rebeat cities name
  conncetion.query(query, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ err: "no book found to retrieve", details: err.message });
    }
    res.json(result);
  });
});

//get bookshop by name
app.get("/bookshop/name/:name", (req, res) => {
  //const { name } = req.body;
  const query = "SELECT * FROM bookshop WHERE name = ?"; //packet
  conncetion.query(query, [req.params.name], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ err: "Error retrieve bookshop", details: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ result: "BookShop name not found" });
    }
    res.json(result);
  });
});

//get by email
app.get("/bookshop/email/:email", (req, res) => {
  const { email } = req.body;
  const query = "SELECT * FROM bookshop WHERE email = ?";
  conncetion.query(query, [req.params.email], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ err: "Error retrieve bookshop", details: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ result: "email not found" });
    }
    res.json(result[0]);
  });
});
//ubdate name
app.put("/bookshop/name/:id", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name != "string") {
    return res.status(400).json({ error: "Missing name" });
  }
  const query = "UPDATE bookshop SET name = ? WHERE shop_id = ?";
  conncetion.query(query, [name, req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ err: "cannot update name", details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "the name not found to update" });
    }
    res.status(200).json({ message: " Name has been updated" });
  });
});

//update email
app.put("/bookshop/email/:id", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }
  const query = "UPDATE bookshop SET email = ? WHERE shop_id=?";
  conncetion.query(query, [email, req.params.id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error updating bookshop email", details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No email found to update" });
    }
    res.status(200).json({ message: " email has been updated" });
  });
});

//add one shops or more

app.post("/bookshop", (req, res) => {
  const { shop_id, city, name, contactNumber, email, Adress } = req.body;
  const query =
    "insert into bookshop (shop_id,city,name,contactNumber,email,Adress) values(?,?,?,?,?,?)";
  conncetion.query(
    query,
    [shop_id, city, name, contactNumber, email, Adress],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "error adding new bookshop", details: err.message });
      }
      res.status(201).json({ message: "bookshop has been added" });
    }
  );
});

//delete shop
app.delete("/bookshop/:id", (req, res) => {
  const query = "DELETE FROM bookshop WHERE shop_id = ?";
  conncetion.query(query, [req.params.id], (err, result) => {
    if (err) {
      res
        .status(500)
        .json({ err: "cannot delete the book", details: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Message: "not found the bookshop to delete" });
    }
    res.status(200).json({ message: "bookshop has been delete" });
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`server has been started on http://localhost:${port}`);
});
