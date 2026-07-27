import {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  
  console.log("APP VERSION 123");
  console.log(todoList);
  
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleCharactersError = (value) => {
    if (value.length < 3 || value.length > 50) {
      throw new Error(
        alert(
          'Todo must have at least 3 characters and less than 50 characters.'
        )
      );
    }
  };

  const addTodo = async () => {
    handleCharactersError(todo);

    try {
      await axios.post('/api/create', {
        todo,
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const getAllTodos = async () => {
    try {
      await axios
        .get('/api/')
        .then((response) => {
          setTodoList(response.data);
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateTodo = async (id) => {
  handleCharactersError(newTodo);

  try {
    await axios.put(`/api/update/${id}`, {
      id,
      todo: newTodo,
    });

    await getAllTodos();
  } catch (err) {
    console.error(err.message);
  }
};

  const deleteTodo = async (id) => {
  try {
    await axios.delete(`/api/${id}`);

    await getAllTodos();
  } catch (err) {
    console.error(err.message);
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

  console.log(todoList);

  return (
    <div className='App'>
      <Layout>
        <TodoForm handleSubmit={handleSubmit} setTodo={setTodo} todo={todo} />
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
