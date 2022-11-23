import { ITodo } from '@/components/Dashboard/Todos'
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
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

export const editTodo = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'todo'>,
) => {
  return updateDoc(getTodoDoc(userId, todoId), newData)
}
