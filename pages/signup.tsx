import Input from '@/components/Login/Input'
import { signup } from '@/lib/auth'
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Inputs } from './login'
import nookies from 'nookies'
import { adminAuth } from '@/lib/firebaseAdmin'
import { useState } from 'react'

const SignUp = () => {
  const [signUpSuccessful, setSIgnUpSuccessful] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setButtonDisabled(true)
    try {
      await signup(data)
      setSIgnUpSuccessful(true)
    } catch (error) {
      alert(error)
    }
    setButtonDisabled(false)
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full px-4">
        <h1 className="font-display text-5xl tracking-tight text-center">
          SIGN UP
        </h1>
        <form className="mt-16 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {signUpSuccessful && (
            <div className="w-full bg-green-500 text-white text-center py-4 rounded">
              Sign up succesful
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
            disabled={buttonDisabled}
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4">
          Already have an account?
          <Link href="/login" legacyBehavior>
            <a className="underline ml-2">Log in here</a>
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

export default SignUp
