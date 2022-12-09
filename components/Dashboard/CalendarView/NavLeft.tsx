import { getInitialColumns, transformDateSlashToDash } from '@/utils/dateHelper'
import { IoHome } from 'react-icons/io5'
import SwiperCore from 'swiper'
import Arrow from './Arrow'
import useColumnStore, { IColumn } from '@/stores/columns'

interface Props {
  navigationDisabled: boolean
  swiperRef: SwiperCore | undefined
  syncToFirebase: (_localState: IColumn[]) => Promise<void>
}

const NavLeft = ({ navigationDisabled, swiperRef, syncToFirebase }: Props) => {
  const columnStore = useColumnStore()
  const onClick = async () => {
    const today = transformDateSlashToDash(new Date().toLocaleDateString())
    const todayIndex = columnStore.columns.map((col) => col.id).indexOf(today)
    if (todayIndex !== -1) {
      swiperRef?.slideTo(todayIndex, 600)
    } else {
      columnStore.setColumns(getInitialColumns())
      await syncToFirebase(getInitialColumns())
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
