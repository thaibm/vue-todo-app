import { ITodo } from "@/types/todo";
const TODO_STORAGE_KEY = "todos";

const DEFALUT_LIST: ITodo[] = [
  { id: 0, text: "The Vue Instance", done: true },
  { id: 1, text: "Vue Directives", done: true },
  { id: 2, text: "Data-binding", done: true },
  { id: 3, text: "Events Handling", done: false },
  { id: 4, text: "Components", done: false },
  { id: 5, text: "Vue-cli", done: false },
  { id: 6, text: "Vue-router", done: false },
  { id: 7, text: "Vuex", done: false },
  { id: 8, text: "Axios", done: false }
];

export const getTodos = (): ITodo[] => {
  const todoString = window.localStorage.getItem(TODO_STORAGE_KEY);
  return todoString ? JSON.parse(todoString) : DEFALUT_LIST;
};

export const saveTodos = (todos: ITodo[]) => {
  window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
};
