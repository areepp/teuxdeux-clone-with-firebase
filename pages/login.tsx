import Input from '@/components/Login/Input'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'

export interface Inputs {
  email: string
  password: string
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full px-4">
        <h1 className="font-display text-5xl tracking-tight text-center">
          LOG IN
        </h1>
        <form className="mt-16 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

export default Login
