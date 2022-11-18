import { db } from './firebaseClient'
import { setDoc, doc } from 'firebase/firestore'

interface Props {
  uid: string
  email: string
}
export const storeUserToFirestore = async ({ uid, email }: Props) => {
  return setDoc(doc(db, 'users', uid), {
    email,
  })
}
