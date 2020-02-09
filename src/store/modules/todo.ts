import { ITodo } from "@/types/todo";
import { VuexModule, Module, Action, getModule } from "vuex-module-decorators";

import store from "@/store";
import { getTodos, saveTodos } from "@/utils/local-storage";

export interface ITodoState {
  todos: ITodo[];
}

@Module({ dynamic: true, store, name: "todo" })
class Todo extends VuexModule implements ITodoState {
  public todos: ITodo[] = getTodos();

  @Action
  public saveTodos(todos: ITodo[]) {
    saveTodos(todos);
  }
}

export const TodoModule = getModule(Todo);
