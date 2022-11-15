import { Inputs } from '@/pages/login'
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

export const logOut = async () => {
  return signOut(clientAuth)
}

export const foo = async () => {
  return 'hei'
}
