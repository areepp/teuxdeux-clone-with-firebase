import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { IoCalendar } from 'react-icons/io5'
import SwiperCore from 'swiper'
import Arrow from './Arrow'

import 'react-day-picker/dist/style.css'
import {
  getReInitiatedDays,
  transformDateSlashToDash,
} from '@/utils/dateHelper'
import useColumnStore, { IColumn } from '@/stores/columns'

interface Props {
  navigationDisabled: boolean
  swiperRef: SwiperCore | undefined
  syncToFirebase: (_localState: IColumn[]) => Promise<void>
}

const NavRight = ({ navigationDisabled, swiperRef, syncToFirebase }: Props) => {
  const columnStore = useColumnStore()

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isCalendarClicked, setIsCalendarClicked] = useState(false)

  const handleBlur = () => {
    // don't close calendar when day picker is clicked
    if (!isCalendarClicked) {
      setIsCalendarOpen(false)
    }
  }

  const handleDayClick = async (day: Date) => {
    const clickedDayIndex = columnStore.columns
      .map((col) => col.id)
      .indexOf(transformDateSlashToDash(day.toLocaleDateString()))

    const withinReach = () => {
      if (clickedDayIndex === -1) {
        return false
      } else if (
        clickedDayIndex > columnStore.columns.length - 4 ||
        clickedDayIndex < 3
      ) {
        return false
      } else {
        return true
      }
    }

    if (withinReach()) {
      swiperRef?.slideTo(clickedDayIndex, 600)
    } else {
      columnStore.setColumns(getReInitiatedDays(day))
      await syncToFirebase(getReInitiatedDays(day))
      swiperRef?.slideTo(7, 0)
    }

    setIsCalendarClicked(false)
    setIsCalendarOpen(false)
  }

  return (
    <nav className="z-50 pt-2 md:w-16 absolute top-14 right-2 md:static  md:border-l border-stone-200">
      <div className="flex flex-col items-center relative">
        <Arrow
          navigationDisabled={navigationDisabled}
          onClick={(e: any) => e.stopPropagation() || swiperRef?.slideNext()}
        />
        <button
          className="mt-2 text-xl text-gray-400 hover:text-primary transition-all duration-300"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          onBlur={handleBlur}
        >
          <IoCalendar />
        </button>
        {isCalendarOpen && (
          <div
            id="day-picker"
            className="absolute right-1/2 top-20 z-50 bg-zinc-50 shadow-lg rounded"
            onMouseDown={() => setIsCalendarClicked(true)} // onMouseDown is fired first before onBlur, prevent calendar closed when the day picker is clicked
          >
            <DayPicker mode="single" onDayClick={handleDayClick} />
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavRight
