<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input
        class="new-todo"
        autocomplete="off"
        placeholder="Todo List"
        @keyup.enter="addTodo"
      />
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input
        id="toggle-all"
        :checked="allChecked"
        class="toggle-all"
        type="checkbox"
        @change="toggleAll({ done: !allChecked })"
      />
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo-item
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize("item") }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a
            :class="{ selected: visibility === key }"
            @click.prevent="visibility = key"
            >{{ key | capitalize }}</a
          >
        </li>
      </ul>
      <button
        class="clear-completed"
        v-show="todos.length > remaining"
        @click="clearCompleted"
      >
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component } from "vue-property-decorator";
import TodoItem from "./components/TodoItem.vue";
import { ETodoType, ITodo } from "@/types/todo";
import { TodoModule } from "@/store/modules/todo";

const filters: { [key: string]: Function } = {
  all: (todos: ITodo[]) => todos,
  active: (todos: ITodo[]) => todos.filter(todo => !todo.done),
  completed: (todos: ITodo[]) => todos.filter(todo => todo.done)
};

@Component({
  name: "Todo",
  components: {
    TodoItem
  },
  filters: {
    pluralize: (number: number, text: string) =>
      number === 1 || number === 0 ? text : text + "s",
    capitalize: (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
  }
})
export default class Todo extends Vue {
  private ETodoType = ETodoType;
  private visibility = ETodoType.All;
  private todos = TodoModule.todos;

  // Compute function
  get allChecked() {
    return this.todos.every((todo: ITodo) => {
      return todo.done;
    });
  }

  get filters() {
    return filters;
  }

  get filteredTodos() {
    return filters[this.visibility](this.todos);
  }

  get remaining() {
    return this.todos.filter((todo: ITodo) => !todo.done).length;
  }

  private mounted() {
    this.setLocalStorage();
  }

  private setLocalStorage() {
    TodoModule.saveTodos(this.todos);
  }

  private addTodo(e: KeyboardEvent) {
    const text = (e.target as HTMLInputElement).value;
    if (text.trim()) {
      this.todos.push({
        id: this.todos.length,
        text,
        done: false
      });
      this.setLocalStorage();
    }
    (e.target as HTMLInputElement).value = "";
  }

  private toggleTodo(todo: ITodo) {
    todo.done = !todo.done;
    this.setLocalStorage();
  }

  private deleteTodo(todo: ITodo) {
    this.todos.splice(this.todos.indexOf(todo), 1);
    this.setLocalStorage();
  }

  private editTodo({ todo, value }: { todo: ITodo; value: string }) {
    todo.text = value;
    this.setLocalStorage();
  }

  private clearCompleted() {
    this.todos = this.todos.filter((todo: ITodo) => !todo.done);
    this.setLocalStorage();
  }

  private toggleAll({ done }: { done: boolean }) {
    this.todos.forEach((todo: ITodo) => {
      todo.done = done;
      this.setLocalStorage();
    });
  }
}
</script>

<style lang="scss" scope>
.todoapp {
  font: 14px "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  color: #4d4d4d;
  min-width: 230px;
  max-width: 550px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
  background: #fff;
  z-index: 1;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 25px 50px 0 rgba(0, 0, 0, 0.1);

  button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :focus {
    outline: 0;
  }

  .hidden {
    display: none;
  }

  h1 {
    position: absolute;
    top: -155px;
    width: 100%;
    font-size: 100px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
  }

  input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }

  input::-moz-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #e6e6e6;
  }

  input::input-placeholder {
    font-style: italic;
    font-weight: 300;
    color: #f1f0f0;
  }

  .new-todo,
  .edit {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 18px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: 0;
    color: inherit;
    padding: 6px;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .new-todo {
    padding: 10px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }

  .main {
    position: relative;
    z-index: 2;
    border-top: 1px solid #e6e6e6;
  }

  .toggle-all {
    text-align: center;
    border: none;
    /* Mobile Safari */
    opacity: 0;
    position: absolute;
  }

  .toggle-all + label {
    width: 60px;
    height: 34px;
    font-size: 0;
    position: absolute;
    top: -52px;
    left: -13px;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }

  .toggle-all + label:before {
    content: "❯";
    font-size: 22px;
    color: #e6e6e6;
    padding: 10px 27px 10px 27px;
  }

  .toggle-all:checked + label:before {
    color: #737373;
  }

  .todo-list {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      position: relative;
      font-size: 24px;
      border-bottom: 1px solid #ededed;

      &:last-child {
        border-bottom: none;
      }

      &.editing {
        border-bottom: none;
        padding: 0;

        .edit {
          display: block;
          width: 506px;
          padding: 12px 16px;
          margin: 0 0 0 43px;
        }

        .view {
          display: none;
        }
      }

      .toggle {
        text-align: center;
        width: 40px;
        /* auto, since non-WebKit browsers doesn't support input styling */
        height: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
        margin: auto 0;
        border: none;
        /* Mobile Safari */
        -webkit-appearance: none;
        appearance: none;

        & + label {
          /*
          Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
          IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
        */
          background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center left;
          background-size: 36px;
        }

        &:checked + label {
          background-size: 36px;
          background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E");
        }
      }

      label {
        word-break: break-all;
        padding: 15px 15px 15px 50px;
        display: block;
        line-height: 1;
        font-size: 14px;
        transition: color 0.4s;
      }

      &.completed label {
        color: #d9d9d9;
        text-decoration: line-through;
      }

      .destroy {
        display: none;
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        width: 40px;
        height: 40px;
        margin: auto 0;
        font-size: 30px;
        color: #cc9a9a;
        transition: color 0.2s ease-out;
        cursor: pointer;

        &:hover {
          color: #af5b5e;
        }

        &:after {
          content: "×";
        }
      }

      &:hover .destroy {
        display: block;
      }

      .edit {
        display: none;
      }

      &.editing:last-child {
        margin-bottom: -1px;
      }
    }
  }

  .footer {
    color: #777;
    position: relative;
    padding: 10px 15px;
    height: 40px;
    text-align: center;
    border-top: 1px solid #e6e6e6;

    &:before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 40px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
        0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
        0 17px 2px -6px rgba(0, 0, 0, 0.2);
    }
  }

  .todo-count {
    float: left;
    text-align: left;

    strong {
      font-weight: 300;
    }
  }

  .filters {
    margin: 0;
    padding: 0;
    position: relative;
    z-index: 1;
    list-style: none;
  }

  .filters li {
    display: inline;

    a {
      color: inherit;
      font-size: 12px;
      padding: 3px 7px;
      text-decoration: none;
      border: 1px solid transparent;
      border-radius: 3px;

      &:hover {
        border-color: rgba(175, 47, 47, 0.1);
      }

      &.selected {
        border-color: rgba(175, 47, 47, 0.2);
      }
    }
  }

  .clear-completed,
  html .clear-completed:active {
    float: right;
    position: relative;
    line-height: 20px;
    text-decoration: none;
    cursor: pointer;
  }

  .clear-completed:hover {
    text-decoration: underline;
  }

  .info {
    margin: 65px auto 0;
    color: #bfbfbf;
    font-size: 10px;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
    text-align: center;

    p {
      line-height: 1;
    }

    a {
      color: inherit;
      text-decoration: none;
      font-weight: 400;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  /*
  Hack to remove background from Mobile Safari.
  Can't use it globally since it destroys checkboxes in Firefox
*/
  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    .toggle-all,
    .todo-list li .toggle {
      background: none;
    }

    .todo-list li .toggle {
      height: 40px;
    }
  }

  @media (max-width: 430px) {
    .footer {
      height: 50px;
    }
  }
}
</style>
