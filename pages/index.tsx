import Header from '@/components/Header'
import * as authService from '@/lib/auth.service'
import { useRouter } from 'next/router'
import { withAuthServerSideProps } from '@/lib/withAuthServerSideProps'
import Dashboard from '@/components/Dashboard'

const Index = () => {
  const router = useRouter()
  const handleLogOut = async () => {
    await authService.logOut()
    console.log('hei')
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-full">
      <Header />
      <Dashboard />
      <button className="fixed top-3 right-4 text-white" onClick={handleLogOut}>
        log out
      </button>
    </div>
  )
}

export const getServerSideProps = withAuthServerSideProps()

export default Index
