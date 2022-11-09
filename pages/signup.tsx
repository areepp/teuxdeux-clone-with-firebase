import Input from '@/components/Login/Input'
import Link from 'next/link'

const SignUp = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full px-4">
        <h1 className="font-display text-5xl tracking-tight text-center">
          SIGN UP
        </h1>
        <form className="mt-16 space-y-4">
          <Input text="email" />
          <Input text="password" />
          <button
            className="w-full text-lg py-4 bg-red-600 rounded text-gray-100"
            type="submit"
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

export default SignUp
