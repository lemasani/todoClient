import { useState, useEffect } from 'react';
import PageBackground from '../Components/PageBackground';

// utils
import axios from 'axios';
import {getTodos} from './../Utils/endpoints';



//icons
import { FaPlus, FaTrash, FaCheck, FaEdit } from 'react-icons/fa';

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

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);

  const [todos, setTodos] = useState([])
  const todosPerPage = 6;

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
        <div className="p-4 rounded-lg h-full flex flex-col w-100">
          <div className="top px-5 py-2 flex justify-between w-100">
            <h4 className="text-xl font-light">Home | Todos</h4>
            <button className="text-white ml-4 px-4 py-1 flex items-center bg-blue-500 rounded border-none">
              <FaPlus /> Todo
            </button>
          </div>
          <div className="content px-5">
            <p className="text-gray-600">List of current Todos</p>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {todos.length === 0 ? (
                <div className="container">
                  <h4>No todos start creating</h4>
                </div>
              ) : (currentTodos.map((todo, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    <h5 className="text-lg font-bold">{todo.title}</h5>
                    <p className="text-gray-600">{todo.description}</p>
                    <p className="text-gray-500 text-sm">Due: {todo.dueDate}</p>
                  </div>
                  <div className="flex flex-col justify-evenly">
                  <button
                      className="text-green-500 ml-4 mb-2 px-4 py-1 flex items-center bg-green-100 rounded border-none"
                      onClick={() => handleStatusUpdate(index, 'completed')}
                    >
                      <FaCheck /> Mark as Done
                    </button>
                    <button
                      className="text-blue-500 ml-4 mb-2 px-4 py-1 flex items-center bg-blue-100 rounded border-none"
                      onClick={() => handleEdit(index)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="text-red-500 ml-4 mb-2 px-4 py-1 flex items-center bg-red-100 rounded border-none"
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
        </div>
      </PageBackground>
    </>
  );
}
