import { logOut } from '@/lib/auth'
import { adminAuth } from '@/lib/firebaseAdmin'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()
  const handleLogOut = async () => {
    await logOut()
    console.log('hei')
    router.push('/login')
  }

  return (
    <>
      <div className="font-display text-5xl tracking-tighter">
        MONDAY TUESDAY
      </div>
      <button onClick={handleLogOut}>log out</button>
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
