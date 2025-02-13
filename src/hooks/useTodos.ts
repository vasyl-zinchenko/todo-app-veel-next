import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTodos, createTodo, deleteTodo } from '@/api/todos';
import { Todo } from '@/types';

export const useTodos = () => {
  const queryClient = useQueryClient();

  const todos = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const addTodo = useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo: Partial<Todo>) => {
      const tempId = crypto.randomUUID();
      const tempTodo = {
        ...newTodo,
        id: tempId,
        uniqueId: tempId,
        completed: false,
      };

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => [
        ...(oldTodos || []),
        tempTodo,
      ]);

      return { previousTodos, tempId };
    },
    onError: (
      error: Error,
      newTodo: Partial<Todo>,
      context?: { previousTodos?: Todo[]; tempId?: string }
    ) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      console.error('Failed to add todo:', error);
    },
    onSuccess: (newTodo, _, context) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) =>
        oldTodos?.map((todo) =>
          todo.id.toString() === context?.tempId
            ? { ...todo, ...newTodo }
            : todo
        )
      );
    },
  });

  const removeTodo = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      await deleteTodo(id);
    },
    onMutate: async (todo: { id: number; uniqueId?: string }) => {
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) =>
        oldTodos?.filter(
          (t) =>
            (todo.uniqueId && t.uniqueId !== todo.uniqueId) ||
            (!todo.uniqueId && t.id !== todo.id)
        )
      );

      return { previousTodos };
    },
    onError: (
      error,
      todo,
      context?: { previousTodos?: Todo[]; tempId?: string }
    ) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      console.error('Failed to delete todo:', error);
    },
  });

  return { todos, addTodo, removeTodo };
};
