import update from 'immutability-helper'
import create from 'zustand'

export interface ITodo {
  id: string
  text: string
  checked: boolean
}

interface State {
  todos: ITodo[]
}

interface TodoStore {
  todos: ITodo[]
  setTodos: (_todos: ITodo[]) => void
  pushTodo: (_newTodo: ITodo) => void
  deleteTodo: (_todoId: string) => void
  editTodoChecked: (_todoId: string, _data: boolean) => void
  editTodoText: (_todoId: string, _text: string) => void
}

const useTodoStore = create<TodoStore>((set: any) => ({
  todos: [],
  setTodos: (todos: ITodo[]) => set(() => ({ todos })),
  pushTodo: (newTodo: ITodo) =>
    set((state: State) => ({
      todos: update(state.todos, {
        $push: [newTodo],
      }),
    })),
  deleteTodo: (todoId: string) =>
    set((state: State) => ({
      todos: state.todos.filter((todo) => todo.id !== todoId),
    })),
  editTodoChecked: (todoId: string, data: boolean) =>
    set((state: State) => ({
      todos: state.todos.map((todo) =>
        (todo.id === todoId ? { ...todo, checked: data } : todo)), // prettier-ignore
    })),
  editTodoText: (todoId: string, text: string) =>
    set((state: State) => ({
      todos: state.todos.map((todo) =>
        (todo.id === todoId ? { ...todo, text } : todo)), // prettier-ignore
    })),
}))

export default useTodoStore
