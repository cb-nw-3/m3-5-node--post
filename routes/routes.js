//empty array to hold items in the to-do list
let items = [];

//renders the todo-page.ejs via .get()
const handleHomePage = (req, res) => {
  res.render("todo-page", { items: items });
};

//handles form data via .post() and redirects the to-do page with updated items
const handleData = (req, res) => {
  //create variable to hold value of input text from the form
  let { item } = req.body;
  console.log(item);

  //push the value into the items array
  items.push(item);
  console.log("the current items are:", items);

  //redirect to the todos endpoint to re-render the page with new items
  res.status(200).redirect("/todos");
};

//export all handlers
module.exports = {
  handleHomePage: handleHomePage,
  handleData: handleData,
};
