import Header from '@/components/Dashboard/Header'
import Todos from '@/components/Dashboard/Todos'
import * as authService from '@/lib/auth.service'
import { adminAuth } from '@/lib/firebaseAdmin'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const Index = () => {
  const router = useRouter()
  const handleLogOut = async () => {
    await authService.logOut()
    console.log('hei')
    router.push('/login')
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Header />
      <main className="p-4 min-h-[575px] flex flex-col">
        <Todos />
      </main>
      <button className="fixed top-3 right-4 text-white" onClick={handleLogOut}>
        log out
      </button>
    </DndProvider>
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
