import { db } from './firebaseClient'
import { addDoc, collection } from 'firebase/firestore'

interface Props {
  uid: string
  email: string
}
export const storeUserToFirestore = async ({ uid, email }: Props) => {
  return addDoc(collection(db, 'users'), {
    uid,
    email,
  })
}
