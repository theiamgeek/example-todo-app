import { component } from 'riot';
import TodoApp from './todo-app.riot';

document.addEventListener('DOMContentLoaded', () => {
  component(TodoApp)(document.querySelector('todo-app') || document.body);
});
