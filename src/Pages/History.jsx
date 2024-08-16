import { useState, useEffect } from 'react';
import PageBackground from '../Components/PageBackground';
import { getTodos } from './../Utils/endpoints';

export default function History() {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [viewMode, setViewMode] = useState('table'); 

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        let todos = await getTodos(userId);
        if (!Array.isArray(todos)) {
          todos = [];
        }
        setCompletedTodos(todos.filter((todo) => todo.status === 'completed'));
      } catch (error) {
        console.error('Error fetching completed todos', error);
      }
    };
    fetchCompletedTodos();
  }, []);

  return (
    <>
      <PageBackground>
        <div className="flex justify-center mb-4">
          <h1 className="text-2xl font-bold">Completed Todos History</h1>
        </div>
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 mx-1 ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button
            className={`px-4 py-2 mx-1 ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setViewMode('cards')}
          >
            Cards View
          </button>
        </div>
        <div className="container mx-auto p-4">
          {viewMode === 'table' ? (
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
                  </tr>
                </thead>
                <tbody>
                  {completedTodos.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-2 border-b border-gray-200 text-center">
                        No completed todos available
                      </td>
                    </tr>
                  ) : (
                    completedTodos.map((todo) => (
                      <tr key={todo._id}>
                        <td className="px-4 py-2 border-b border-gray-200">
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200">
                          {todo.title}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-200">
                          {todo.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {completedTodos.length === 0 ? (
                <p className="text-center col-span-full">No completed todos available</p>
              ) : (
                completedTodos.map((todo) => (
                  <div key={todo._id} className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold">{todo.title}</h3>
                    <p>{todo.description}</p>
                    <p className="text-sm text-gray-500">{new Date(todo.dueDate).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </PageBackground>
    </>
  );
}