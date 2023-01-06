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
  doc(db, 'users', userId, 'calendar', columnId)

export const editTodoOrder = async (
  userId: string,
  columnId: string,
  order: string[],
) =>
  setDoc(
    getColumnDocRef(userId, columnId),
    {
      order,
    },
    { merge: true },
  )

export const getDayColumnsByIds = async (
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

    // prettier-ignore
    batches.push(
      getDocs(q).then((results) =>
        results.docs.map((result) =>
          ({ id: result.id, ...result.data() }))),
    )
  }

  return Promise.all(batches)
}

export const getDayColumn = async (userId: string, columnId: string) =>
  getDoc(getColumnDocRef(userId, columnId))

export const addTodoToColumn = async (
  userId: string,
  columnId: string,
  todoId: string,
) =>
  setDoc(
    getColumnDocRef(userId, columnId),
    {
      order: arrayUnion(todoId),
    },
    { merge: true },
  )

export const deleteTodoFromColumn = async (
  userId: string,
  columnId: string,
  todoId: string,
) =>
  setDoc(
    getColumnDocRef(userId, columnId),
    {
      order: arrayRemove(todoId),
    },
    { merge: true },
  )
