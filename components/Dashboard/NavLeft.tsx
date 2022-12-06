import { IoHome } from 'react-icons/io5'
import SwiperCore from 'swiper'
import Arrow from './Arrow'

interface Props {
  navigationDisabled: boolean
  swiperRef: SwiperCore | undefined
}

const NavLeft = ({ navigationDisabled, swiperRef }: Props) => {
  return (
    <nav className="z-50 md:w-16 absolute md:static top-14 left-2 flex flex-col items-center pt-2 md:border-r border-stone-200">
      <Arrow
        left
        navigationDisabled={navigationDisabled}
        onClick={(e: any) => e.stopPropagation() || swiperRef?.slidePrev()}
      />
      <button className="mt-2 text-xl text-gray-400">
        <IoHome />
      </button>
    </nav>
  )
}

export default NavLeft
