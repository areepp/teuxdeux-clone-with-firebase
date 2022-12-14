import useListStore from '@/stores/lists'
import SwiperCore from 'swiper'
import Arrow from '../Common/Arrow'

interface Props {
  swiperRef: SwiperCore | undefined
  activeSlideIndex: number
}

const NavRight = ({ swiperRef, activeSlideIndex }: Props) => {
  const { listOrder } = useListStore()
  return (
    <nav className="z-30 md:w-16 absolute md:static top-14 right-2 flex flex-col items-center pt-2 md:border-l border-stone-200">
      <Arrow
        navigationDisabled={activeSlideIndex === listOrder.length - 3}
        onClick={(e: any) => e.stopPropagation() || swiperRef?.slideNext()}
      />
    </nav>
  )
}

export default NavRight
