/* eslint-disable react-hooks/exhaustive-deps */
import { onIdTokenChanged, User } from 'firebase/auth'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clientAuth } from '@/lib/firebaseClient'
import Loading from './Auth/Loading'

const AuthContext = createContext<{ user: User | null }>({
  user: null,
})

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null)

  const [loading, setLoading] = useState<Boolean>(true)
  const router = useRouter()

  // listen for token changes
  useEffect(
    () =>
      onIdTokenChanged(clientAuth, async (userFirebaseAuth) => {
        if (!userFirebaseAuth) {
          setUser(null)
          nookies.set(undefined, 'token', '', { path: '/' })
          setLoading(false)
        } else {
          const token = await userFirebaseAuth.getIdToken()
          setUser(userFirebaseAuth)
          nookies.set(undefined, 'token', token, { path: '/' })
          await router.push('/')
          setLoading(false)
        }
      }),
    [],
  )

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const userFirebaseAuth = clientAuth.currentUser
      if (userFirebaseAuth) await userFirebaseAuth.getIdToken(true)
    }, 10 * 60 * 1000)

    // clean up setInterval
    return () => clearInterval(handle)
  }, [])

  const value = useMemo(() => ({ user }), [user])

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
