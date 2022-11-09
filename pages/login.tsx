import Input from '@/components/Login/Input'
import Link from 'next/link'

const Login = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full px-4">
        <h1 className="font-display text-5xl tracking-tight text-center">
          LOG IN
        </h1>
        <form className="mt-16 space-y-4">
          <Input text="email" />
          <Input text="password" />
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
