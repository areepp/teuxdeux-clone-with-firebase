import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebaseClient'

const getTodoCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'lists')

const getListDocRef = (userId: string, listId: string) =>
  doc(db, 'users', userId, 'lists', listId)

export const getLists = async (userId: string) => {
  return getDocs(getTodoCollectionRef(userId))
}

export const addList = async (userId: string) => {
  return addDoc(getTodoCollectionRef(userId), { title: '' })
}

export const addToListOrder = async (
  userId: string,
  listId: string,
  todoId: string,
) => {
  return setDoc(
    getListDocRef(userId, listId),
    {
      order: arrayUnion(todoId),
    },
    { merge: true },
  )
}

export const rearrangeTodoOrder = async (
  userId: string,
  listId: string,
  order: string[],
) => {
  return setDoc(
    getListDocRef(userId, listId),
    {
      order,
    },
    { merge: true },
  )
}
