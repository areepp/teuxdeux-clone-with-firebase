import Input from '@/components/Login/Input'
import { login } from '@/lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import nookies from 'nookies'
import { adminAuth } from '@/lib/firebaseAdmin'
import { GetServerSidePropsContext } from 'next'

export interface Inputs {
  email: string
  password: string
}

const Login = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitDisabled, setSubmitDisabled] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setSubmitDisabled(true)
    try {
      await login(data)
      router.push('/')
    } catch (error: any) {
      setError('Incorrect email and/or password')
    }
    setSubmitDisabled(false)
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full px-4">
        <h1 className="font-display text-5xl tracking-tight text-center">
          LOG IN
        </h1>
        <form className="mt-16 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="w-full py-4 bg-red-100 border-stone-300 rounded text-center">
              {error}
            </div>
          )}
          <Input text="email" register={register} />
          {errors.email && (
            <span className="text-xs">This field is required</span>
          )}

          <Input text="password" register={register} />
          {errors.password && (
            <span className="text-xs">This field is required</span>
          )}

          <button
            className="w-full text-lg py-4 bg-red-600 rounded text-gray-100"
            type="submit"
            disabled={submitDisabled}
          >
            Log in
          </button>
        </form>
        <p className="mt-4">
          Don&apos;t have an account?
          <Link href="/signup" legacyBehavior>
            <a className="underline ml-2">Sign up here</a>
          </Link>
        </p>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // user found in the cookies
    const cookies = nookies.get(ctx)
    const token = await adminAuth.verifyIdToken(cookies.token)

    const { uid } = token

    ctx.res.writeHead(302, { Location: '/' })
    ctx.res.end()

    return {
      props: { message: `user ${uid} already logged in. Redirect to /` },
    }
  } catch (err) {
    //user not found in the cookies
    return { props: {} as never }
  }
}

export default Login
