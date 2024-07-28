import axios from "./api";

export const getTodos = async (userId) => {
  try {
    const response = await axios.get(`/api/todos?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching todos', error);
    throw error;
  }
};