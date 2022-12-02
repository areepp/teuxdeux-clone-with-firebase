import Arrow from './Arrow'
import { IoCalendar, IoHome } from 'react-icons/io5'
import { DayPicker } from 'react-day-picker'

import 'react-day-picker/dist/style.css'
import { useState } from 'react'
import { KeenSliderHooks, KeenSliderInstance } from 'keen-slider'

interface Props {
  instanceRef: React.MutableRefObject<KeenSliderInstance<
    {},
    {},
    KeenSliderHooks
  > | null>
}

const Navigation = ({ instanceRef }: Props) => {
  const [selectedDay, setSelectedDay] = useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <nav className="relative z-50">
      <div className="absolute flex flex-col items-center top-3 left-2">
        <Arrow
          left
          onClick={(e: any) =>
            e.stopPropagation() || instanceRef.current?.prev()
          }
        />
        <button className="mt-2 text-xl text-gray-400">
          <IoHome />
        </button>
      </div>
      <div className="absolute flex flex-col items-center top-3 right-2">
        <Arrow
          onClick={(e: any) =>
            e.stopPropagation() || instanceRef.current?.next()
          }
        />
        <button
          className="mt-2 text-xl text-gray-400"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <IoCalendar />
        </button>
        {isCalendarOpen && (
          <div className="absolute right-1/2 top-full bg-zinc-50 shadow-lg rounded">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              modifiersClassNames={{
                today: '',
              }}
            />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
