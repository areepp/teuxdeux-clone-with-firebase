import * as authService from '@/lib/auth.service'
import { useRouter } from 'next/router'

const SignOutBtn = () => {
  const router = useRouter()
  const handleLogOut = async () => {
    await authService.logOut()
    router.push('/login')
  }

  return (
    <div className="absolute h-11 top-0 right-4 flex items-center">
      <button
        className="bg-white px-2 py-1 rounded text-xs font-inter text-primary"
        onClick={handleLogOut}
      >
        log out
      </button>
    </div>
  )
}

const Header = () => {
  return (
    <header className="relative flex-none w-full h-11 bg-primary font-gothic text-xl text-gray-200 flex items-center justify-center">
      <h1>BLUPBLUPBLUP</h1>
      <SignOutBtn />
    </header>
  )
}

export default Header
