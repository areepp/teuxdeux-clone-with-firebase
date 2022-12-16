import { clientAuth } from './firebaseClient'
import { Inputs } from '@/pages/login'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

export const signup = (data: Inputs) => {
  const { email, password } = data
  return createUserWithEmailAndPassword(clientAuth, email, password)
}

export const login = async (data: Inputs) => {
  const { email, password } = data
  return signInWithEmailAndPassword(clientAuth, email, password)
}

export const logOut = async () => {
  return signOut(clientAuth)
}
