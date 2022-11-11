import { logOut } from '@/lib/auth'
import { adminAuth } from '@/lib/firebaseAdmin'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()
  const handleLogOut = async () => {
    await logOut()
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
    const cookies = nookies.get(ctx)
    const token = await adminAuth.verifyIdToken(cookies.token)

    const { uid, email } = token

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.` },
    }
  } catch (err) {
    ctx.res.writeHead(302, { Location: '/login' })
    ctx.res.end()

    return { props: {} as never }
  }
}

export default Index
