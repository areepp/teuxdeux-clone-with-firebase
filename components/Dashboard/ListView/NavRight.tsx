import SwiperCore from 'swiper'
import Arrow from '../Common/Arrow'

interface Props {
  swiperRef: SwiperCore | undefined
}

const NavRight = ({ swiperRef }: Props) => {
  return (
    <nav className="z-50 md:w-16 absolute md:static top-14 right-2 flex flex-col items-center pt-2 md:border-l border-stone-200">
      <Arrow
        onClick={(e: any) => e.stopPropagation() || swiperRef?.slideNext()}
      />
    </nav>
  )
}

export default NavRight
