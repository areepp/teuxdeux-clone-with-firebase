import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { IoCalendar } from 'react-icons/io5'
import SwiperCore from 'swiper'
import {
  getReInitiatedDays,
  transformDateSlashToDash,
} from '@/helper/dateHelper'
import MyOutsideClickHandler from '@/components/Common/MyOutsideClickHandler'

import useDayStore from '@/stores/days'
import { IDayColumn } from '@/types/IDayColumn'

import Arrow from '../Common/Arrow'

interface Props {
  navigationDisabled: boolean
  swiperRef: SwiperCore | undefined
  syncDayColumns: (_localState: IDayColumn[]) => Promise<void>
}

const NavRight = ({ navigationDisabled, swiperRef, syncDayColumns }: Props) => {
  const columnStore = useDayStore()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleDayClick = async (day: Date) => {
    setIsCalendarOpen(false)

    const clickedDayIndex = columnStore.dayColumns
      .map((col) => col.id)
      .indexOf(transformDateSlashToDash(day.toLocaleDateString()))

    const withinReach = () => {
      if (clickedDayIndex === -1) {
        return false
      }
      // prettier-ignore
      if (
        clickedDayIndex > columnStore.dayColumns.length - 4
        || clickedDayIndex < 3
      ) {
        return false
      }
      return true
    }

    if (withinReach()) {
      swiperRef?.slideTo(clickedDayIndex, 600)
    } else {
      columnStore.setColumns(getReInitiatedDays(day))
      await syncDayColumns(getReInitiatedDays(day))
      swiperRef?.slideTo(7, 0)
    }
  }

  return (
    <nav className="z-30 pt-2 md:w-16 absolute top-14 right-2 md:static  md:border-l border-stone-200">
      <div className="relative flex flex-col items-center">
        <Arrow
          navigationDisabled={navigationDisabled}
          onClick={(e: any) => e.stopPropagation() || swiperRef?.slideNext()}
        />
        <button
          type="button"
          className="mt-2 text-xl text-gray-400 hover:text-primary transition-all duration-300"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <IoCalendar />
        </button>
        {isCalendarOpen && (
          <MyOutsideClickHandler
            onOutsideClick={() => setIsCalendarOpen(false)}
          >
            <div
              id="day-picker"
              className="absolute right-1/2 top-20 z-50 bg-zinc-50 shadow-lg rounded"
            >
              <DayPicker mode="single" onDayClick={handleDayClick} />
            </div>
          </MyOutsideClickHandler>
        )}
      </div>
    </nav>
  )
}

export default NavRight
