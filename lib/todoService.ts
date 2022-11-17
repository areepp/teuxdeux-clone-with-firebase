import { addDoc, collection } from 'firebase/firestore'
import { db } from './firebaseClient'
import TODOS_DATA from '@/data/todos.json'

interface NewTodo {
  item: string
}

export const getTodo = () => {
  return TODOS_DATA
}

export const addTodo = async (newTodo: NewTodo) => {
  try {
    const docRef = await addDoc(collection(db, 'user'), newTodo)
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}
