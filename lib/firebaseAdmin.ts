import { cert, getApp, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// import getConfig from 'next/config'

// const { publicRuntimeConfig } = getConfig()
// const { FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = publicRuntimeConfig

const { FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env

const { privateKey } = JSON.parse(FIREBASE_PRIVATE_KEY as string)

const initializeAppIfNecessary = () => {
  try {
    return getApp()
  } catch {
    return initializeApp({
      credential: cert({
        projectId: 'teuxdeux-clone',
        privateKey,
        clientEmail: FIREBASE_CLIENT_EMAIL,
      }),
    })
  }
}

const app = initializeAppIfNecessary()
export const adminAuth = getAuth(app)
