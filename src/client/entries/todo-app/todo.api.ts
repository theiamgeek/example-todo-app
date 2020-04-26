import {TodoModel} from '../../../server/models/todo-model';


export async function getTodos(): Promise<TodoModel[]> {
  const response = await window.fetch(
    '/api/todos',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get todos!');
  }

  return (await response.json()).map((record: Partial<TodoModel>) => new TodoModel(record));
}

export async function createTodo(todo: TodoModel): Promise<void> {
  const response = await window.fetch(
    '/api/todos',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todo)
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create new Todo!');
  }
}

export async function updateTodo(todo: TodoModel): Promise<void> {
  const response = await window.fetch(
    `/api/todos/${todo.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: todo.title,
        complete: todo.complete
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update Todo!');
  }
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await window.fetch(
    `/api/todos/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update Todo!');
  }
}
