import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  documentId,
} from 'firebase/firestore'
import { db } from './firebaseClient'

const getColumnDocRef = (userId: string, columnId: string) =>
  // firestore doesn't accept forward slash as id, so i transform the forward slash of the date to '-' first
  doc(db, 'users', userId, 'calendar', columnId)

export const rearrangeOrder = async (
  userId: string,
  columnId: string,
  order: string[],
) => {
  return setDoc(
    getColumnDocRef(userId, columnId),
    {
      order,
    },
    { merge: true },
  )
}

export const getColumnByIds = async (
  userId: string,
  columnTodosIds: string[],
) => {
  const batches = []

  while (columnTodosIds.length) {
    const batch = columnTodosIds.splice(0, 10)
    const q = query(
      collection(db, 'users', userId, 'calendar'),
      where(documentId(), 'in', [...batch]),
    )

    batches.push(
      getDocs(q).then((results) =>
        results.docs.map((result) => ({ id: result.id, ...result.data() })),
      ),
    )
  }

  return Promise.all(batches)
}

export const getColumn = async (userId: string, columnId: string) => {
  return getDoc(getColumnDocRef(userId, columnId))
}

export const addToOrderList = async (
  userId: string,
  columnId: string,
  todoId: string,
) => {
  return setDoc(
    getColumnDocRef(userId, columnId),
    {
      order: arrayUnion(todoId),
    },
    { merge: true },
  )
}

export const deleteFromOrderList = async (
  userId: string,
  columnId: string,
  todoId: string,
) => {
  return setDoc(
    getColumnDocRef(userId, columnId),
    {
      order: arrayRemove(todoId),
    },
    { merge: true },
  )
}
