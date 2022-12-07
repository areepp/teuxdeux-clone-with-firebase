import { getInitialDays, transformDateSlashToDash } from '@/utils/dateHelper'
import { IoHome } from 'react-icons/io5'
import SwiperCore from 'swiper'
import Arrow from './Arrow'
import { IColumn } from './Column'

interface Props {
  navigationDisabled: boolean
  swiperRef: SwiperCore | undefined
  columns: IColumn[]
  setColumns: React.Dispatch<React.SetStateAction<IColumn[]>>
}

const NavLeft = ({
  columns,
  setColumns,
  navigationDisabled,
  swiperRef,
}: Props) => {
  const onClick = () => {
    const today = transformDateSlashToDash(new Date().toLocaleDateString())
    const todayIndex = columns.map((col) => col.id).indexOf(today)
    if (todayIndex !== -1) {
      swiperRef?.slideTo(todayIndex, 600)
    } else {
      setColumns(getInitialDays())
    }
  }

  return (
    <nav className="z-50 md:w-16 absolute md:static top-14 left-2 flex flex-col items-center pt-2 md:border-r border-stone-200">
      <Arrow
        left
        navigationDisabled={navigationDisabled}
        onClick={(e: any) => e.stopPropagation() || swiperRef?.slidePrev()}
      />
      <button
        onClick={onClick}
        className="mt-2 text-xl text-gray-400 hover:text-primary transition-all duration-300"
      >
        <IoHome />
      </button>
    </nav>
  )
}

export default NavLeft
