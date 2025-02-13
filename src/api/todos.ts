import { Todo } from '@/types';
import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

export const fetchTodos = async () => {
  const response = await axios.get(`${BASE_URL}?_limit=10`);
  if (response.status !== 200) throw new Error('Failed to fetch todos');
  return response.data;
};

export const createTodo = async (newTodo: Partial<Todo>) => {
  const response = await axios.post(BASE_URL, newTodo);
  return response.data;
};

export const deleteTodo = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  if (response.status !== 200) throw new Error('Failed to delete todo');
};
