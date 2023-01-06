import '../styles/globals.css'
import { AuthProvider } from '@/components/AuthContext'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    <Analytics />
  </>
)

export default App
