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

export const markTodo = async (id, status) =>{
  try {
    const response = await axios.put(`/api/todos/${id}`, {
      id,
      status,
    })

    return response.data;
  } catch (error) {
    console.log('Error marking todo', error)
  }
}

export const editTodo = async (id, todoData) => {
  try {
    const response = await axios.patch(`/api/todos/${id}`, {todoData });
    return response.data;
  } catch (error) {
    console.log('error editing todo Client:', error.response.data);
  }
};


export const deleteTodo = async (id) =>{
  try {
    const response = await axios.delete(`/api/todos/${id}`)

    return response.data;
  } catch (error) {
    console.log('error deleting', error)
  }
}