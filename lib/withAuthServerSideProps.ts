import { GetServerSidePropsContext } from 'next'
import { adminAuth } from '@/lib/firebaseAdmin'
import nookies from 'nookies'

export function withAuthServerSideProps(getServerSidePropsFunc?: Function) {
  return async (context: GetServerSidePropsContext) => {
    try {
      // user found in the cookies
      const { token } = nookies.get(context)
      const user = await adminAuth.verifyIdToken(token)

      if (getServerSidePropsFunc) {
        return { props: { data: await getServerSidePropsFunc(context, user) } }
      }

      return { props: {} as never }
    } catch (err) {
      // user not found in the cookies
      context.res.writeHead(302, {
        Location: '/login',
      })
      context.res.end()
      return { props: {} as never }
    }
  }
}
