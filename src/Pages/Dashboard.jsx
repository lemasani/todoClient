import { useState, useEffect } from 'react';
import PageBackground from '../Components/PageBackground';
import TodoForm from '../Components/TodoForm';

// utils
import axios from 'axios';
import { getTodos, postTodo } from './../Utils/endpoints';

//icons
import { FaTrash, FaCheck, FaEdit } from 'react-icons/fa';

const sampleTodos = [
  {
    title: 'Buy groceries',
    description: 'Milk, Bread, Cheese, Eggs',
    dueDate: '2023-10-10',
  },
  {
    title: 'Finish project',
    description: 'Complete the final report and submit',
    dueDate: '2023-10-15',
  },
  {
    title: 'Workout',
    description: 'Go to the gym for a workout session',
    dueDate: '2023-10-12',
  },
  // Add more todos as needed
];

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [todos, setTodos] = useState([]);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const todosPerPage = 6;

  const postTodoHandler = async (todoData) => {
    try {
      const newTodo = await postTodo(todoData);
      console.log('Todo created:', newTodo);
      setTodos([...todos, newTodo]);
      setShowTodoForm(false);
    } catch (error) {
      console.error('Error creating todo', error);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        let todos = await getTodos(userId);
        if (!Array.isArray(todos)) {
          todos = [];
        }
        setTodos(todos);
      } catch (error) {
        console.error('Error fetching todos', error);
      }
    };
    fetchTodos();
  }, []);

  const handleDelete = (index) => {
    console.log(`Delete todo at index: ${index}`);
  };

  const handleStatusUpdate = async (index, status) => {
    try {
      const todo = sampleTodos[index];
      const response = await axios.post('/api/todos/mark', {
        id: todo._id,
        status,
      });
      console.log(`Updated todo status: ${response.data}`);
    } catch (error) {
      console.error('Error updating todo status', error);
    }
  };

  const handleEdit = (index) => {
    console.log(`Edit todo at index: ${index}`);
  };

  // Calculate the todos to display on the current page
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  // Calculate total pages
  const totalPages = Math.ceil(todos.length / todosPerPage);

  return (
    <>
      <PageBackground>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-light">Home | Todo</h1>
            <button
              className="text-white bg-blue-500 px-4 py-2 rounded-md"
              onClick={() => setShowTodoForm(!showTodoForm)}
            >
              {showTodoForm ? 'Cancel' : 'Create Todo'}
            </button>
          </div>
          {showTodoForm && <TodoForm onSuccess={postTodoHandler} />}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todos.length === 0 ? (
              <div>
                <h4>No todos</h4>
              </div>
            ) : (currentTodos.map((todo, index) => (
              <div key={index} className="bg-white p-4 rounded-md shadow-md">
                <h2 className="text-xl font-bold">{todo.title}</h2>
                <p>{todo.description}</p>
                <p>Due: {formatDate(todo.dueDate)}</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="text-green-500 mr-2"
                    onClick={() => handleStatusUpdate(index, 'completed')}
                  >
                    <FaCheck /> Complete
                  </button>
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => handleEdit(index)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(index)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            )))}
          </div>
          {todos.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-gray-300 rounded"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 bg-gray-300 rounded"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </PageBackground>
    </>
  );
}