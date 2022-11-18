import Input from '@/components/Login/Input'
import { signup } from '@/lib/authService'
import { adminAuth } from '@/lib/firebaseAdmin'
import { storeUserToFirestore } from '@/lib/userService'
import { FirebaseError } from 'firebase/app'
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import nookies from 'nookies'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Inputs } from './login'

interface IMessage {
  text: string
  type: 'success' | 'error'
}

const SignUp = () => {
  const [message, setMessage] = useState<IMessage | null>(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setButtonDisabled(true)
    try {
      const res = await signup(data)
      const { uid, email } = res.user
      if (email) await storeUserToFirestore({ uid, email })
      setMessage({ text: 'Sign up succesful', type: 'success' })
      reset()
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setMessage({ text: error.message, type: 'error' })
      }
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
          {message && (
            <div
              className={`w-full ${
                message.type == 'error'
                  ? 'bg-red-100 border-stone-300'
                  : 'bg-green-500 text-white'
              }  text-center py-4 rounded`}
            >
              {message.text}
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
    const { token } = nookies.get(ctx)
    await adminAuth.verifyIdToken(token)

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } catch (err) {
    //user not found in the cookies
    return { props: {} as never }
  }
}

export default SignUp
