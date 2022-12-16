import { useAuth } from '../AuthContext'
import * as authService from '@/lib/auth.service'
import { useRouter } from 'next/router'
import { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

const Profile = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [isProfileClicked, setIsProfileClicked] = useState(false)

  const handleLogOut = async () => {
    await authService.logOut()
    router.push('/login')
  }

  return (
    <div className="absolute h-11 top-0 right-4 flex items-center">
      <p
        className="cursor-pointer hover:text-white transition-all"
        onClick={() => setIsProfileClicked(!isProfileClicked)}
      >
        {user?.email}
      </p>
      {isProfileClicked && (
        <OutsideClickHandler onOutsideClick={() => setIsProfileClicked(false)}>
          <button
            className="z-50 absolute top-3/4 left-2 bg-white px-2 py-1 rounded text-xs font-inter text-primary border border-primary"
            onClick={handleLogOut}
          >
            log out
          </button>
        </OutsideClickHandler>
      )}
    </div>
  )
}

const Header = () => {
  return (
    <header className="relative flex-none w-full h-11 bg-primary font-gothic text-xl text-gray-200 flex items-center justify-center">
      <h1>BLUPBLUPBLUP</h1>
      <Profile />
    </header>
  )
}

export default Header
