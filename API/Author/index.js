const Router = require("express").Router();

const AuthorModel = require("../../database/author");

//----------------------------------------Authors------------------------------------//
/*
Route           /author
Description     get all author
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ getAllAuthors });
});

/*
  Route           /author/:isbn
  Description     get specific author
  Access          PUBLIC
  Parameters      names
  Method          GET
  */
Router.get("/:name", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({
    name: req.params.name,
  });
  if (!getSpecificAuthor.length) {
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
Router.get("/:books", async (req, res) => {
  const getAuthorSpecificBooks = await AuthorModel.findOne({
    books: req.params.books,
  });
  if (!getAuthorSpecificBooks.length) {
    return res.json({
      error: `No Author found for the book of ${req.params.books}`,
    });
  }
  return res.json({ Author: getAuthorSpecificBooks });
});
/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/

Router.post("/new", async (req, res) => {
  const { newAuthor } = req.body;
  AuthorModel.create(newAuthor);

  return res.json({ message: "author was added!" });
});
/*
Route           /author/delete/:isbn
Description     delete a author
Access          PUBLIC
Parameters      NONE
Method          DELETE
*/
Router.delete("/delete/:id", async (req, res) => {
  const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: parseInt(req.params.id),
  });
  //const updatedAuthorDatabase = database.authors.filter(
  //  (author) => author.id !== parseInt(req.params.id)
  // );

  return res.json({ books: updatedAuthorDatabase });
});
module.exports = Router;
