import { Inputs } from '@/components/Auth/Input'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { clientAuth } from './firebaseClient'

export const signup = (data: Inputs) => {
  const { email, password } = data
  return createUserWithEmailAndPassword(clientAuth, email, password)
}

export const login = async (data: Inputs) => {
  const { email, password } = data
  return signInWithEmailAndPassword(clientAuth, email, password)
}

// prettier-ignore
export const logOut = async () => signOut(clientAuth)
