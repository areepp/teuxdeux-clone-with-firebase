import Header from '@/components/Dashboard/Header'
import CalendarView from '@/components/Dashboard/CalendarView'
import * as authService from '@/lib/auth.service'
import { adminAuth } from '@/lib/firebaseAdmin'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import nookies from 'nookies'

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
      <CalendarView />
      <button className="fixed top-3 right-4 text-white" onClick={handleLogOut}>
        log out
      </button>
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const { token } = nookies.get(ctx)
    await adminAuth.verifyIdToken(token)

    return {
      props: {} as never,
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
}

export default Index
