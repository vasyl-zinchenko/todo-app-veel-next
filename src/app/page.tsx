'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Todo } from '@/types';
import Loading from '@/components/Loading';

export default function TodoApp() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const { todos, addTodo, removeTodo } = useTodos();

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    addTodo.mutate({
      title: newTodoTitle,
      completed: false,
      uniqueId: crypto.randomUUID(),
    });

    setNewTodoTitle('');
  };

  const handleRemoveTodo = (todo: Todo) => {
    removeTodo.mutate(todo);
  };

  if (todos.isLoading) return <Loading />;

  if (todos.isError)
    return (
      <p className='text-red-600 container mx-auto mt-10 max-w-md p-4'>
        Error: {(todos.error as Error).message}
      </p>
    );

  return (
    <div className='container mx-auto mt-10 max-w-md p-4 shadow-[0_5px_15px_#00000059] bg-[#202124] rounded-md'>
      <form onSubmit={handleAddTodo} className='mb-4 flex space-x-2'>
        <input
          type='text'
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder='Enter a new todo'
          className='flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <button
          type='submit'
          disabled={
            todos.isLoading || addTodo.isPending || !newTodoTitle.trim()
          }
          className='px-4 py-2 bg-cyan-700 text-white font-semibold rounded-md hover:bg-cyan-900 disabled:bg-slate-400'
        >
          Add
        </button>
      </form>

      <ul className='space-y-2'>
        {todos?.data?.map((todo: Todo) => (
          <li
            key={todo.uniqueId || `server-id-${todo.id}`}
            className='flex justify-between items-center p-2 shadow-sm border-b-[1px] border-b-gray-600'
          >
            <span className='text-slate-50'>{todo.title}</span>
						
            <button
              onClick={() => handleRemoveTodo(todo)}
              className='text-red-500 hover:text-red-700 '
            >
              <Trash2 size={16} strokeWidth={1} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
