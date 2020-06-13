const todos = [];

const handleToDos = (req, res) => {
    res.render('pages/todos', {todos: todos});
};

const handleData = (req, res) => {
const {todo} = req.body;
todos.push(todo);

res.redirect('/');
}

module.exports = {
    handleToDos,
    handleData,
}