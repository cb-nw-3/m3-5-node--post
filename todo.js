
let todoItems = [];

const handleTODOFormData = (req, res) =>
{
    const newItem = {
        item: req.body.item,
        urgent: req.body.urgent
    }
    addItem(req, res, newItem);
}

const addItem = (req, res, item) =>
{
    todoItems.push(item);
    renderTodoListPage(req, res);

}

const renderTodoListPage = (req, res) => 
{
    console.log(todoItems);
    res.status(200).render('pages/todo', {items:todoItems});
}



module.exports = {
    renderTodoListPage,
    handleTODOFormData
};