import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  documentId,
  where,
  writeBatch,
  setDoc,
} from 'firebase/firestore'
import { ITodo } from '@/stores/todos'
import { db } from './firebaseClient'

const getTodoCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'todos')

const getTodoDocRef = (userId: string, todoId: string) =>
  doc(db, 'users', userId, 'todos', todoId)

export const getAllTodos = (userId: string) =>
  getDocs(getTodoCollectionRef(userId))

export const getColumnTodos = (userId: string, columnTodosIds: string[]) => {
  const q = query(
    getTodoCollectionRef(userId),
    where(documentId(), 'in', columnTodosIds),
  )
  return getDocs(q)
}

export const addTodo = async (
  userId: string,
  newTodoId: string,
  newTodo: Omit<ITodo, 'id'>,
) => setDoc(getTodoDocRef(userId, newTodoId), newTodo)

export const deleteTodo = async (userId: string, todoId: string) =>
  deleteDoc(getTodoDocRef(userId, todoId))

export const deleteMultipleTodos = async (
  userId: string,
  deletedIds: string[],
) => {
  const batch = writeBatch(db)

  for (let i = 0; i < deletedIds.length; i++) {
    batch.delete(getTodoDocRef(userId, deletedIds[i]))
  }
  return batch.commit()
}

export const editTodoChecked = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'checked'>,
) => updateDoc(getTodoDocRef(userId, todoId), newData)

export const editTodoText = async (
  userId: string,
  todoId: string,
  newData: Pick<ITodo, 'text'>,
) => updateDoc(getTodoDocRef(userId, todoId), newData)
