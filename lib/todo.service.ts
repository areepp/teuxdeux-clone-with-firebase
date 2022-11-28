import { ITodo } from '@/components/Dashboard/TodoItem'
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from './firebaseClient'

const getTodoCollection = (userId: string) =>
  collection(db, 'users', userId, 'todos')

const getTodoDoc = (userId: string, todoId: string) =>
  doc(db, 'users', userId, 'todos', todoId)

const getListDoc = (userId: string) =>
  doc(db, 'users', userId, 'lists', 'today')

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

export const rearrangeListOrder = async (userId: string, order: string[]) => {
  return updateDoc(getListDoc(userId), {
    order,
  })
}

export const getList = async (userId: string) => {
  return getDoc(getListDoc(userId))
}

export const addToListOrder = async (userId: string, todoId: string) => {
  return updateDoc(getListDoc(userId), {
    order: arrayUnion(todoId),
  })
}

export const deleteFromListOrder = async (userId: string, todoId: string) => {
  return updateDoc(getListDoc(userId), {
    order: arrayRemove(todoId),
  })
}
