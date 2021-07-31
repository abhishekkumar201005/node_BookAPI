require("dotenv").config();
const express = require("express");
// for mongoose database
const mongoose = require("mongoose");
// Database
const database = require("./database/index");

//Initialising express
const shapeAI = express();

// Configurations express
shapeAI.use(express.json());

// Established Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connection Established to Mongodb Database"));
//------------------=================GET METHOD==================----------------------//

//----------------------Books-------------------------------------------------//
/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

shapeAI.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
Route           /is/:isbn
Description     get specific book
Access          PUBLIC
Parameters      isbn
Method          GET
*/
shapeAI.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }
  return res.json({ book: getSpecificBook });
});

/*
Route           /c/:category
Description     get list of book based on category
Access          PUBLIC
Parameters      category
Method          GET
*/
shapeAI.get("/c/:category", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );
  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }
  return res.json({ books: getSpecificBooks });
});

/*
Route           /a/:authors
Description     get list of book based on Authors
Access          PUBLIC
Parameters      authors
Method          GET
*/
shapeAI.get("/a/:authors", (req, res) => {
  const getSpecificAuthors = database.books.filter((book) =>
    book.authors.includes(req.params.authors)
  );
  if (getSpecificAuthors.length === 0) {
    return res.json({
      error: `No book found for the Author of ${req.params.authors}`,
    });
  }
  return res.json({ books: getSpecificAuthors });
});

//----------------------------------------Authors------------------------------------//
/*
Route           /author
Description     get all author
Access          PUBLIC
Parameters      NONE
Method          GET
*/
shapeAI.get("/author", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
Route           /author/:names
Description     get specific author
Access          PUBLIC
Parameters      names
Method          GET
*/
shapeAI.get("/author/:names", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (auth) => auth.names === req.params.name
  );
  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found for the name of ${req.params.name}`,
    });
  }
  return res.json({ AUTHOR: getSpecificAuthor });
});

/*
Route           /auth/:books
Description     get list of authors based on books
Access          PUBLIC
Parameters      books
Method          GET
*/
shapeAI.get("/auth/:books", (req, res) => {
  const getAuthorSpecificBooks = database.authors.filter((book) =>
    book.books.includes(req.params.books)
  );
  if (getAuthorSpecificBooks.length === 0) {
    return res.json({
      error: `No Author found for the book of ${req.params.books}`,
    });
  }
  return res.json({ Author: getAuthorSpecificBooks });
});

//--------------------------Publications------------------------------------//
/*
Route           /
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

shapeAI.get("/publications", (req, res) => {
  return res.json({ Publications: database.publications });
});

/*
Route           /publication/:name
Description     get specific Publications
Access          PUBLIC
Parameters      name
Method          GET
*/
shapeAI.get("/publication/:name", (req, res) => {
  const getPubSpecificBook = database.publications.filter(
    (book) => book.name === req.params.name
  );
  if (getPubSpecificBook.length === 0) {
    return res.json({
      error: `No publication found for the name of ${req.params.name}`,
    });
  }
  return res.json({ Publications: getPubSpecificBook });
});

/*
Route           /Pub/:books
Description     get list of Publications based on books
Access          PUBLIC
Parameters      books
Method          GET
*/
shapeAI.get("/Pub/:books", (req, res) => {
  const getPublSpecificBooks = database.publications.filter((book) =>
    book.books.includes(req.params.books)
  );
  if (getPublSpecificBooks.length === 0) {
    return res.json({
      error: `No Author found for the book of ${req.params.books}`,
    });
  }
  return res.json({ Publications: getPublSpecificBooks });
});

//--------------------------------------------------------------//
//---------------POST Method ----------------------------------//
/*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/

shapeAI.post("/book/new", (req, res) => {
  const { newBook } = req.body;
  database.books.push(newBook);
  return res.json({ books: database.books, message: "Books was added!!!!!" });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/

shapeAI.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;
  database.authors.push(newAuthor);
  return res.json({
    books: database.authors,
    message: "Author was added!!!!!",
  });
});

/*
Route           /publ/new
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/

shapeAI.post("/publ/new", (req, res) => {
  const { newPubl } = req.body;
  database.publications.push(newPubl);
  return res.json({
    books: database.Publications,
    message: "Publications was added!!!!!",
  });
});

//------------------PUT Method----------------//
/*
Route           /book/update
Description     add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

shapeAI.put("/book/update/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.bookTitle;
      return;
    }
  });
  return res.json({ books: database.books });
});

/*
Route           /book/author/update
Description     update/add new author✅ 
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

shapeAI.put("/book/author/update/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.authors.push(req.body.newAuthor);
    }
  });
  database.authors.forEach((author) => {
    if (author.id === req.body.newAuthor)
      return author.books.push(req.params.isbn);
  });
  return res.json({
    books: database.books,
    authors: database.authors,
    message: "New Author added",
  });
});

/*
Route           /publication/update/book
Description     update/add new book to a publication✅
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
shapeAI.put("/publication/update/book/:isbn", (req, res) => {
  // update the publication database
  database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "Successfully updated publication",
  });
});

//-==================DELETE========================//
/*
Route           /book/delete/:isbn
Description     delete a book
Access          PUBLIC
Parameters      NONE
Method          DELETE
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.books = updatedBookDatabase;
  return res.json({ books: database.books });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          PUBLIC
Parameters      isbn, author id
Method          DELETE
*/
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
  // update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );
      book.authors = newAuthorList;
      return;
    }
  });

  // update the author database
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );

      author.books = newBooksList;
      return;
    }
  });

  return res.json({
    message: "author was deleted!!!!!!😪",
    book: database.books,
    author: database.authors,
  });
});

/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
  // update publication database
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  // update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
  });
});

/*
Route           /author/delete/:isbn
Description     delete a author
Access          PUBLIC
Parameters      NONE
Method          DELETE
*/
shapeAI.delete("/author/delete/:id", (req, res) => {
  const updatedAuthorDatabase = database.authors.filter(
    (author) => author.id !== parseInt(req.params.id)
  );

  database.authors = updatedAuthorDatabase;
  return res.json({ books: database.authors });
});

/*
Route           /publication/delete/:isbn
Description     delete a author
Access          PUBLIC
Parameters      NONE
Method          DELETE
*/
shapeAI.delete("/publication/delete/:id", (req, res) => {
  const updatedPubDatabase = database.publications.filter(
    (author) => author.id !== parseInt(req.params.id)
  );

  database.publications = updatedPubDatabase;
  return res.json({ books: database.publications });
});
// For Server start
shapeAI.listen(3000, () => console.log("Server is start"));
