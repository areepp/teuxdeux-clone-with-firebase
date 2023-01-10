import { useRouter } from 'next/router'
import { useState } from 'react'
import * as authService from '../../lib/auth.service'
import { useAuth } from '../AuthContext'
import MyOutsideClickHandler from '../Common/MyOutsideClickHandler'

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
      <button
        type="button"
        className="cursor-pointer hover:text-white transition-all"
        onClick={() => setIsProfileClicked(!isProfileClicked)}
      >
        {user?.email}
      </button>

      {isProfileClicked && (
        <MyOutsideClickHandler
          onOutsideClick={() => setIsProfileClicked(!isProfileClicked)}
        >
          <button
            type="button"
            className="z-50 absolute top-3/4 left-2 bg-white px-2 py-1 rounded text-xs font-inter text-primary border border-primary"
            onClick={handleLogOut}
          >
            log out
          </button>
        </MyOutsideClickHandler>
      )}
    </div>
  )
}

const Header = () => (
  <header className="relative flex-none w-full h-11 bg-primary font-gothic text-xl text-gray-200 flex items-center justify-center">
    <h1>BLUPBLUPBLUP</h1>
    <Profile />
  </header>
)

export default Header
