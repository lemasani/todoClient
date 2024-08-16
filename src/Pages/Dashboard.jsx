import { useState, useEffect } from 'react';
import PageBackground from '../Components/PageBackground';
import TodoForm from '../Components/TodoForm';

// utils
import { getTodos, postTodo, deleteTodo, markTodo } from './../Utils/endpoints';

//icons
import { FaTrash, FaCheck, FaEdit } from 'react-icons/fa';

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
  const [viewMode, setViewMode] = useState('table');
  const todosPerPage = 6;

  const postTodoHandler = async (todoData) => {
    try {
      const newTodo = await postTodo(todoData);
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

        setTodos(todos.filter((todo) => todo.status !== 'completed'));
      } catch (error) {
        console.error('Error fetching todos', error);
      }
    };
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    try {
      console.log(`Delete todo id: ${id}`);
      const response = await deleteTodo(id);
      console.log('Deleted todo:', response);

      // Update the todos state by filtering out the deleted todo
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  const handleMark = async (id, status) => {
    console.log(`Mark todo id: ${id} as ${status}`);
    const response = await markTodo(id, status);
    console.log('Marked Todo:', response);
    // Update the status of the todo in the state and filter out completed todos
    setTodos(
      todos
        .map((todo) => (todo._id === id ? { ...todo, status } : todo))
        .filter((todo) => todo.status !== 'completed')
    );
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
          {showTodoForm ? (
            <TodoForm onSuccess={postTodoHandler} />
          ) : (
            <>
              <div className="todocontainer">
                <div className="buttonContainer mb-2">
                  <button
                    className={`px-4 py-2 mx-1 ${
                      viewMode === 'table'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300'
                    }`}
                    onClick={() => setViewMode('table')}
                  >
                    Table View
                  </button>
                  <button
                    className={`px-4 py-2 mx-1 ${
                      viewMode === 'cards'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300'
                    }`}
                    onClick={() => setViewMode('cards')}
                  >
                    Cards View
                  </button>
                </div>
                {viewMode === 'table' ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr>
                            <th className="px-2 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                              Date
                            </th>
                            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                              Title
                            </th>
                            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                              Description
                            </th>
                            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTodos.length === 0 ? (
                            <tr>
                              <td
                                colSpan="4"
                                className="px-4 py-2 border-b border-gray-200 text-center"
                              >
                                No todos available
                              </td>
                            </tr>
                          ) : (
                            currentTodos.map((todo) => (
                              <tr key={todo._id}>
                                <td className="px-4 py-2 border-b border-gray-200">
                                  {formatDate(todo.dueDate)}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-200">
                                  {todo.title}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-200">
                                  {todo.description}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-200">
                                  <button
                                    className="text-green-500 mr-2"
                                    onClick={() =>
                                      handleMark(todo._id, 'completed')
                                    }
                                  >
                                    <FaCheck /> Mark Done
                                  </button>
                                  <button
                                    className="text-blue-500 mr-2"
                                    onClick={() => handleEdit(todo._id)}
                                  >
                                    <FaEdit /> Edit
                                  </button>
                                  <button
                                    className="text-red-500"
                                    onClick={() => handleDelete(todo._id)}
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {todos.length === 0 ? (
                        <div>
                          <h4>No todos</h4>
                        </div>
                      ) : (
                        currentTodos.map((todo) => (
                          <div
                            key={todo._id}
                            className={`p-4 rounded-md shadow-md`}
                          >
                            <h2 className="text-xl font-bold">{todo.title}</h2>
                            <p>{todo.description}</p>
                            <p>Due: {formatDate(todo.dueDate)}</p>
                            <div className="flex justify-end mt-4">
                              <button
                                className="text-green-500 mr-2 flex flex-col justify-center items-center"
                                onClick={() =>
                                  handleMark(todo._id, 'completed')
                                }
                              >
                                <FaCheck /> Mark Done
                              </button>
                              {todo.status === 'completed' ? null : (
                                <>
                                  <button
                                    className="text-blue-500 mr-2"
                                    onClick={() => handleEdit(todo._id)}
                                  >
                                    <FaEdit /> Edit
                                  </button>
                                  <button
                                    className="text-red-500"
                                    onClick={() => handleDelete(todo._id)}
                                  >
                                    <FaTrash /> Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
                <div>
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
            </>
          )}
        </div>
      </PageBackground>
    </>
  );
}
