const Router = require("express").Router();

const PublicationModel = require("../../database/publication");
//--------------------------Publications------------------------------------//
/*
Route           /
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get("/", async (req, res) => {
  const getAllBooks = await PublicationModel.find();
  return res.json(getAllBooks);
});

/*
  Route           /publication/:name
  Description     get specific Publications
  Access          PUBLIC
  Parameters      name
  Method          GET
  */
Router.get("/:name", async (req, res) => {
  const getPubSpecificBook = await PublicationModel.findOne({
    name: req.params.name,
  });
  if (!getPubSpecificBook.length) {
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
Router.get("/:books", async (req, res) => {
  const getPublSpecificBooks = await PublicationModel.findOne({
    books: req.params.books,
  });
  if (!getPublSpecificBooks.length) {
    return res.json({
      error: `No Author found for the book of ${req.params.books}`,
    });
  }
  return res.json({ Publications: getPublSpecificBooks });
});
/*
Route           /publ/new
Description     add new Publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/

Router.post("/new", async (req, res) => {
  const { newPubl } = req.body;
  PublicationModel.create(newPubl);
  return res.json({
    message: "Publications was added!!!!!",
  });
});
/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
  // update publication database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.pubId),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );

  // update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    { new: true }
  );
  // database.books.forEach((book) => {
  // if (book.ISBN === req.params.isbn) {
  //  book.publication = 0; // no publication available
  //    return;
  //  }
  // });

  return res.json({
    books: updatedBook,
    publications: updatedPublication,
  });
});
/*
Route           /publication/delete/:isbn
Description     delete a publication
Access          PUBLIC
Parameters      NONE
Method          DELETE
*/
Router.delete("/delete/:id", async (req, res) => {
  const updatedPubDatabase = await PublicationModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  //const updatedPubDatabase = database.publications.filter(
  //   (author) => author.id !== parseInt(req.params.id)
  // );
  return res.json({ books: updatedPubDatabase });
});

/*
  Route           /publication/update/book
  Description     update/add new book to a publication✅
  Access          PUBLIC
  Parameters      isbn
  Method          PUT
  */
Router.put("/update/book/:isbn", async (req, res) => {
  // update the publication database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      authors: req.body.pubId,
    },
    {
      $addToSet: {
        ISBN: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  // update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authors: req.body.pubId,
      },
    },
    {
      new: true,
    }
  );

  return res.json({
    books: updatedBook,
    publications: updatedPublication,
    message: "Successfully updated publication",
  });
});
module.exports = Router;
