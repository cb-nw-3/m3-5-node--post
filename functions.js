const items = [];

const handleFormData = (req, res) => {
  const { item } = req.body;
  items.push(item);
  res.redirect("/todos");
};

const handleHomePage = (req, res) => {
  res.render("pages/todos", { items: items });
};

const handle404 = (req, res) => {
  res.status(404);
};

module.exports = {
  handleFormData,
  handleHomePage,
  handle404,
};
