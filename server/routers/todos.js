const { Router } = require('express');
const { TodoRecord } = require('../records/todo.record');

const TodoRouter = Router();

TodoRouter
  .get('/', async (req, res) => {
    const todosList = await TodoRecord.listAll();
    res.status(200).json(todosList);
  })

  .post('/create', async (req, res) => {
    const newTodo = new TodoRecord(req.body);
    await newTodo.insert();

    res.status(201).json({
      message: 'Values inserted successfully',
      todo: newTodo,
    });
  })

  .delete('/:id', async (req, res) => {
    const todo = await TodoRecord.getOne(req.params.id);
    await todo.delete();

    res.sendStatus(204);
  })

  .put('/update/:id', async (req, res) => {
    const todo = await TodoRecord.getOne(req.params.id);
    await todo.update(req.body.id, req.body.todo);

    res.status(200).json({
      message: 'Todo updated successfully',
    });
  });

module.exports = {
  TodoRouter,
};
