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
import { IList } from '@/stores/lists'
import { db } from './firebaseClient'

const getListCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'lists', 'listsCollection', 'collection')

const getListDocRef = (userId: string, listId: string) =>
  doc(db, 'users', userId, 'lists', 'listsCollection', 'collection', listId)

const getListOrderDocRef = (userId: string) =>
  doc(db, 'users', userId, 'lists', 'listOrder')

export const getLists = async (userId: string) =>
  getDocs(getListCollectionRef(userId))

export const getListOrder = async (userId: string) =>
  getDoc(getListOrderDocRef(userId))

export const addList = async (userId: string) =>
  addDoc(getListCollectionRef(userId), { title: '', order: [] })

export const deleteList = async (userId: string, deletedId: string) =>
  deleteDoc(getListDocRef(userId, deletedId))

export const editListTitle = async (
  userId: string,
  id: string,
  newData: Pick<IList, 'title'>,
) => updateDoc(getListDocRef(userId, id), newData)

export const addToListOrder = async (userId: string, listId: string) =>
  setDoc(
    getListOrderDocRef(userId),
    {
      order: arrayUnion(listId),
    },
    { merge: true },
  )

export const deleteFromListOrder = async (userId: string, deletedId: string) =>
  setDoc(
    getListOrderDocRef(userId),
    {
      order: arrayRemove(deletedId),
    },
    { merge: true },
  )

export const editListOrder = async (userId: string, listOrder: string[]) =>
  updateDoc(getListOrderDocRef(userId), {
    order: listOrder,
  })

export const addTodoToList = async (
  userId: string,
  listId: string,
  todoId: string,
) =>
  setDoc(
    getListDocRef(userId, listId),
    {
      order: arrayUnion(todoId),
    },
    { merge: true },
  )

export const deleteTodoFromList = async (
  userId: string,
  listId: string,
  todoId: string,
) =>
  setDoc(
    getListDocRef(userId, listId),
    {
      order: arrayRemove(todoId),
    },
    { merge: true },
  )

export const editTodoOrder = async (
  userId: string,
  listId: string,
  order: string[],
) =>
  setDoc(
    getListDocRef(userId, listId),
    {
      order,
    },
    { merge: true },
  )
