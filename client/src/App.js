import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  console.log("APP VERSION 123");

  const isInvalidTodo = (value) => {
    if (!value || value.trim().length < 3 || value.trim().length > 50) {
      alert('Todo must have at least 3 characters and less than 50 characters.');
      return true;
    }
    return false;
  };

  const addTodo = async () => {
    if (isInvalidTodo(todo)) return;

    try {
      await axios.post('/create', { todo });
    } catch (err) {
      console.error("Inbound task addition failure:", err.message);
    }
  };

  const getAllTodos = async () => {
    try {
      const response = await axios.get('/');

      if (response.data && Array.isArray(response.data)) {
        setTodoList(response.data);
      } else {
        setTodoList([]);
      }
    } catch (err) {
      console.error("Data refresh mapping execution error:", err.message);
    }
  };

  const updateTodo = async (id) => {
    if (isInvalidTodo(newTodo)) return;

    try {
      await axios.put(`/update/${id}`, {
        id,
        todo: newTodo,
      });

      await getAllTodos();
      setNewTodo('');
    } catch (err) {
      console.error("Inbound update execution error:", err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/${id}`);
      await getAllTodos();
    } catch (err) {
      console.error("Inbound deletion processing trace error:", err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addTodo();
    await getAllTodos();
    setTodo('');
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  console.log("Current active todo records pool:", todoList);

  return (
    <div className='App'>
      <Layout>
        <TodoForm 
          handleSubmit={handleSubmit} 
          setTodo={setTodo} 
          todo={todo} 
        />

        <TodoList
          todoList={todoList}
          setNewTodo={setNewTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />
      </Layout>
    </div>
  );
}

export default App;
