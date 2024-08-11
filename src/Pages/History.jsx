import { useState, useEffect } from 'react';
import PageBackground from '../Components/PageBackground';
import { getTodos } from './../Utils/endpoints';

export default function History() {
  const [completedTodos, setCompletedTodos] = useState([]);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        let todos = await getTodos(userId);
        if (!Array.isArray(todos)) {
          todos = [];
        }
        const completed = todos.filter(todo => todo.status === 'completed');
        setCompletedTodos(completed);
      } catch (error) {
        console.error('Error fetching todos', error);
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
        <div className="container mx-auto p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">Description</th>
                </tr>
              </thead>
              <tbody>
                {completedTodos.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-center text-gray-500">No completed todos</td>
                  </tr>
                ) : (
                  completedTodos.map(todo => (
                    <tr key={todo._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b border-gray-200">{new Date(todo.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border-b border-gray-200">{todo.title}</td>
                      <td className="px-4 py-2 border-b border-gray-200">{todo.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageBackground>
    </>
  );
}