import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebaseClient'

interface Props {
  uid: string
  email: string
}

export const storeUserToFirestore = async ({ uid, email }: Props) =>
  setDoc(doc(db, 'users', uid), { email })
