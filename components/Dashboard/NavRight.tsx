import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { IoCalendar } from 'react-icons/io5'
import SwiperCore from 'swiper'
import Arrow from './Arrow'

import 'react-day-picker/dist/style.css'

interface Props {
  navigationDisabled: boolean
  swiperRef: SwiperCore | undefined
}

const NavRight = ({ navigationDisabled, swiperRef }: Props) => {
  const [selectedDay, setSelectedDay] = useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <nav className="z-50 pt-2 md:w-16 absolute top-14 right-2 md:static  md:border-l border-stone-200">
      <div className="flex flex-col items-center relative">
        <Arrow
          navigationDisabled={navigationDisabled}
          onClick={(e: any) => e.stopPropagation() || swiperRef?.slideNext()}
        />
        <button
          className="mt-2 text-xl text-gray-400"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <IoCalendar />
        </button>
        {isCalendarOpen && (
          <div className="absolute right-1/2 top-20 z-50 bg-zinc-50 shadow-lg rounded">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
            />
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavRight
