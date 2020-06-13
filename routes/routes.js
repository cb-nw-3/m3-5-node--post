//empty array to hold items in the to-do list
let items = [];

//renders the todo-page.ejs via .get()
const handleHomePage = (req, res) => {
  res.render("todo-page", { items: items });
};

//handles form data via .post() and redirects the to-do page with updated items
const handleData = (req, res) => {
  let { item } = req.body;
  console.log(item);
  items.push(item);
  console.log("the current items are:", items);
  res.status(200).redirect("/todos");
};

module.exports = {
  handleHomePage: handleHomePage,
  handleData: handleData,
};
