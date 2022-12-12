import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from './firebaseClient'

const getTodoCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'lists')

export const getLists = async (userId: string) => {
  return getDocs(getTodoCollectionRef(userId))
}

export const addList = async (userId: string) => {
  return addDoc(getTodoCollectionRef(userId), { title: '' })
}
