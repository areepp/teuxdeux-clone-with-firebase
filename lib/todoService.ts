import { ITodo } from '@/components/Dashboard/TodoItem'
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebaseClient'

const getTodoCollection = (userId: string) =>
  collection(db, 'users', userId, 'todos')

const getTodoDoc = (userId: string, todoId: string) =>
  doc(db, 'users', userId, 'todos', todoId)

export const getTodos = (userId: string) => {
  return getDocs(getTodoCollection(userId))
}

export const addTodo = async (userId: string, newTodo: Omit<ITodo, 'id'>) => {
  return addDoc(getTodoCollection(userId), newTodo)
}

export const deleteTodo = async (userId: string, todoId: string) => {
  return deleteDoc(getTodoDoc(userId, todoId))
}

export const editTodoChecked = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'checked'>,
) => {
  return updateDoc(getTodoDoc(userId, todoId), newData)
}

export const editTodoText = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'text'>,
) => {
  return updateDoc(getTodoDoc(userId, todoId), newData)
}

export const rearrange = async (userId: string, order: string[]) => {
  return updateDoc(doc(db, 'users', userId, 'lists', 'today'), {
    order,
  })
}

export const getList = async (userId: string) => {
  return getDoc(doc(db, 'users', userId, 'lists', 'today'))
}
