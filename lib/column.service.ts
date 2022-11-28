import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebaseClient'

const getColumnDocRef = (userId: string, columnId: string) =>
  doc(db, 'users', userId, 'lists', columnId)

export const rearrangeOrder = async (
  userId: string,
  columnId: string,
  order: string[],
) => {
  return updateDoc(getColumnDocRef(userId, columnId), {
    order,
  })
}

export const getColumn = async (userId: string, columnId: string) => {
  return getDoc(getColumnDocRef(userId, columnId))
}

export const addToOrderList = async (
  userId: string,
  columnId: string,
  todoId: string,
) => {
  return updateDoc(getColumnDocRef(userId, columnId), {
    order: arrayUnion(todoId),
  })
}

export const deleteFromOrderList = async (
  userId: string,
  columnId: string,
  todoId: string,
) => {
  return updateDoc(getColumnDocRef(userId, columnId), {
    order: arrayRemove(todoId),
  })
}
