//Router
const Router = require("express").Router();
//Database Models
const BookModel = require("../../database/book");
//----------------------Books-------------------------------------------------//
/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
  Route           /is/:isbn
  Description     get specific book
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */
Router.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });
  console.log(getSpecificBook);
  if (!getSpecificBook.length) {
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
Router.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.findOne({
    category: req.params.category,
  });
  if (!getSpecificBooks.length) {
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
Router.get("/a/:authors", async (req, res) => {
  const getSpecificAuthors = await BookModel.findOne({
    authors: req.params.authors,
  });

  if (!getSpecificAuthors.length) {
    return res.json({
      error: `No book found for the Author of ${req.params.authors}`,
    });
  }
  return res.json({ books: getSpecificAuthors });
});

//---------------POST Method ----------------------------------//
/*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/

Router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;
    await BookModel.create(newBook);
    return res.json({ message: "book was added!" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
//------------------PUT Method------------------------------------------------//
/*
Route           /book/update
Description     add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

Router.put("/update/:isbn", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true,
    }
  );
  return res.json({ books: updatedBook });
});

/*
  Route           /book/author/update
  Description     update/add new author✅ 
  Access          PUBLIC
  Parameters      isbn
  Method          PUT
  */

Router.put("/author/update/:isbn", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authors: req.body.newAuthor,
      },
    },
    {
      new: true,
    }
  );

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );
  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New Author added",
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
Router.delete("/delete/:isbn", async (req, res) => {
  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  return res.json({ books: updatedBookDatabase });
});

/*
  Route           /book/delete/author
  Description     delete a author from a book
  Access          PUBLIC
  Parameters      isbn, author id
  Method          DELETE
  */
Router.delete("/delete/author/:isbn/:authorId", async (req, res) => {
  // update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        authors: parseInt(req.params.authorId),
      },
    },
    { new: true }
  );
  // update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorId),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );
  return res.json({
    message: "author was deleted!!!!!!😪",
    book: updatedBook,
    author: updatedAuthor,
  });
});

module.exports = Router;
