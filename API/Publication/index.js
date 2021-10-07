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
  try {
    const getAllBooks = await PublicationModel.find();
    return res.json(getAllBooks);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/:name
  Description     get specific Publications
  Access          PUBLIC
  Parameters      name
  Method          GET
  */
Router.get("/:name", async (req, res) => {
  try {
    const getPubSpecificBook = await PublicationModel.findOne({
      name: req.params.name,
    });
    if (!getPubSpecificBook.length) {
      return res.json({
        error: `No publication found for the name of ${req.params.name}`,
      });
    }
    return res.json({ Publications: getPubSpecificBook });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /Pub/:books
  Description     get list of Publications based on books
  Access          PUBLIC
  Parameters      books
  Method          GET
  */
Router.get("/:books", async (req, res) => {
  try {
    const getPublSpecificBooks = await PublicationModel.findOne({
      books: req.params.books,
    });
    if (!getPublSpecificBooks.length) {
      return res.json({
        error: `No Author found for the book of ${req.params.books}`,
      });
    }
    return res.json({ Publications: getPublSpecificBooks });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
/*
Route           /publ/new
Description     add new Publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/

Router.post("/new", async (req, res) => {
  try {
    const { newPubl } = req.body;
    PublicationModel.create(newPubl);
    return res.json({
      message: "Publications was added!!!!!",
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
/*
Route           /publication/delete/book
Description     delete a book from publication 
Access          PUBLIC
Parameters      isbn, publication id
Method          DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
  try {
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
  } catch (error) {
    return res.json({ error: error.message });
  }
});
/*
Route           /publication/delete/:isbn
Description     delete a publication
Access          PUBLIC
Parameters      NONE
Method          DELETE
*/
Router.delete("/delete/:id", async (req, res) => {
  try {
    const updatedPubDatabase = await PublicationModel.findOneAndDelete({
      id: parseInt(req.params.id),
    });
    //const updatedPubDatabase = database.publications.filter(
    //   (author) => author.id !== parseInt(req.params.id)
    // );
    return res.json({ books: updatedPubDatabase });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/update/book
  Description     update/add new book to a publication✅
  Access          PUBLIC
  Parameters      isbn
  Method          PUT
  */
Router.put("/update/book/:isbn", async (req, res) => {
  try {
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
  } catch (error) {
    return res.json({ error: error.message });
  }
});
module.exports = Router;
