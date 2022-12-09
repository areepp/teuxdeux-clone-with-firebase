import { ITodo } from '@/components/Dashboard/CalendarView/TodoItem'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  documentId,
  where,
} from 'firebase/firestore'
import { db } from './firebaseClient'

const getTodoCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'todos')

const getTodoDocRef = (userId: string, todoId: string) =>
  doc(db, 'users', userId, 'todos', todoId)

export const getAllTodos = (userId: string) => {
  return getDocs(getTodoCollectionRef(userId))
}

export const getColumnTodos = (userId: string, columnTodosIds: string[]) => {
  const q = query(
    getTodoCollectionRef(userId),
    where(documentId(), 'in', columnTodosIds),
  )
  return getDocs(q)
}

export const addTodo = async (userId: string, newTodo: Omit<ITodo, 'id'>) => {
  return addDoc(getTodoCollectionRef(userId), newTodo)
}

export const deleteTodo = async (userId: string, todoId: string) => {
  return deleteDoc(getTodoDocRef(userId, todoId))
}

export const editTodoChecked = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'checked'>,
) => {
  return updateDoc(getTodoDocRef(userId, todoId), newData)
}

export const editTodoText = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'text'>,
) => {
  return updateDoc(getTodoDocRef(userId, todoId), newData)
}
