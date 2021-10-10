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
  try {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ getAllAuthors });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /:name
  Description     get specific author
  Access          PUBLIC
  Parameters      names
  Method          GET
  */
Router.get("/:name", async (req, res) => {
  try {
    const getSpecificAuthor = await AuthorModel.findOne({
      name: req.params.name,
    });
    if (!getSpecificAuthor.length) {
      return res.json({
        error: `No author found for the name of ${req.params.name}`,
      });
    }
    return res.json({ AUTHOR: getSpecificAuthor });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /auth/:books
  Description     get list of authors based on books
  Access          PUBLIC
  Parameters      books
  Method          GET
  */
Router.get("/:books", async (req, res) => {
  try {
    const getAuthorSpecificBooks = await AuthorModel.findOne({
      books: req.params.books,
    });
    if (!getAuthorSpecificBooks.length) {
      return res.json({
        error: `No Author found for the book of ${req.params.books}`,
      });
    }
    return res.json({ Author: getAuthorSpecificBooks });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/

Router.post("/new", async (req, res) => {
  try {
    const { newAuthor } = req.body;
    AuthorModel.create(newAuthor);
    return res.json({ message: "author was added!" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
/*
Route           /author/delete/:isbn
Description     delete a author
Access          PUBLIC
Parameters      NONE
Method          DELETE
*/
Router.delete("/delete/:id", async (req, res) => {
  try {
    const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
      id: parseInt(req.params.id),
    });
    //const updatedAuthorDatabase = database.authors.filter(
    //  (author) => author.id !== parseInt(req.params.id)
    // );

    return res.json({ books: updatedAuthorDatabase });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
module.exports = Router;
