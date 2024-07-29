import axios from "./api";

export const getTodos = async (userId) => {
  try {
    const response = await axios.get(`/api/todos/${userId}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching todos', error.message);
  }
};

export const postTodo = async (todoData) => {
  try {
    const response = await axios.post('/api/todos', todoData);
    return response.data;
  } catch (error) {
    console.error('Error creating todo', error.message);
    throw error;
  }
};