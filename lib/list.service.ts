import { db } from './firebaseClient'
import { IList } from '@/stores/lists'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

const getListCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'lists', 'listsCollection', 'collection')

const getListDocRef = (userId: string, listId: string) =>
  doc(db, 'users', userId, 'lists', 'listsCollection', 'collection', listId)

const getListOrderDocRef = (userId: string) =>
  doc(db, 'users', userId, 'lists', 'listOrder')

export const getLists = async (userId: string) => {
  return getDocs(getListCollectionRef(userId))
}

export const addList = async (userId: string) => {
  return addDoc(getListCollectionRef(userId), { title: '', order: [] })
}

export const deleteList = async (userId: string, deletedId: string) => {
  return deleteDoc(getListDocRef(userId, deletedId))
}

export const editListTitle = async (
  userId: string,
  id: string,
  newData: Pick<IList, 'title'>,
) => {
  return updateDoc(getListDocRef(userId, id), newData)
}

export const getListOrder = async (userId: string) => {
  return getDoc(getListOrderDocRef(userId))
}

export const addToListOrder = async (userId: string, listId: string) => {
  return setDoc(
    getListOrderDocRef(userId),
    {
      order: arrayUnion(listId),
    },
    { merge: true },
  )
}

export const deleteFromListOrder = async (
  userId: string,
  deletedId: string,
) => {
  return setDoc(
    getListOrderDocRef(userId),
    {
      order: arrayRemove(deletedId),
    },
    { merge: true },
  )
}

export const rearrangeListOrder = async (
  userId: string,
  listOrder: string[],
) => {
  return updateDoc(getListOrderDocRef(userId), {
    order: listOrder,
  })
}

export const addTodoToListOrder = async (
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

export const deleteTodoFromListOrder = async (
  userId: string,
  listId: string,
  todoId: string,
) => {
  return setDoc(
    getListDocRef(userId, listId),
    {
      order: arrayRemove(todoId),
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
