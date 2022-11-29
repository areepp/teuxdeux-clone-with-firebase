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
    <>
      <Header />
      <main className="p-4 min-h-[575px] flex flex-col">
        <CalendarView />
      </main>
      <button className="fixed top-3 right-4 text-white" onClick={handleLogOut}>
        log out
      </button>
    </>
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
