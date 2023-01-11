import { useState } from 'react'
import SwiperCore from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getNextFourDays, getPastFourDays } from '@/helper/dateHelper'
import useDayStore from '@/stores/days'
import { IDayColumn } from '@/types/IDayColumn'
import useSettingStore from '@/stores/settings'
import useTodoStore, { ITodo } from '@/stores/todos'
import DayColumn from './DayColumn'
import NavLeft from './NavLeft'
import NavRight from './NavRight'

interface Props {
  syncDayColumns: (_dayColumns: IDayColumn[]) => Promise<void>
}

const CalendarView = ({ syncDayColumns }: Props) => {
  const columnStore = useDayStore()
  const todoStore = useTodoStore()
  const settingStore = useSettingStore()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>()
  const [navigationDisabled, setNavigationDisabled] = useState(false)

  return (
    <section className="relative bg-white flex-grow min-h-[500px] pt-12 md:pt-4 md:flex">
      <NavLeft
        swiperRef={swiperRef}
        navigationDisabled={navigationDisabled}
        syncDayColumns={syncDayColumns}
      />

      <div className="h-full md:w-main">
        <Swiper
          className="h-full"
          onSwiper={setSwiperRef}
          initialSlide={7} // initial set to the current day
          slidesPerView={settingStore.slidesPerView}
          allowTouchMove={false}
          speed={600}
          // disable navigation on transition so that the "onTransitionEnd" hook properly called
          onSlideChangeTransitionStart={() => setNavigationDisabled(true)}
          onSlideChangeTransitionEnd={() => setNavigationDisabled(false)}
          onTransitionEnd={async (e) => {
            const minusValue = settingStore.slidesPerView + 1
            if (e.activeIndex === columnStore.dayColumns.length - minusValue) {
              // add new columns when reaching the end, in this case three elements away
              // from the end of the column array (right navigation)
              const nextFourDays = getNextFourDays(
                columnStore.dayColumns[columnStore.dayColumns.length - 1].id,
              )
              columnStore.pushColumns(nextFourDays)
              await syncDayColumns([...columnStore.dayColumns, ...nextFourDays])
            }
            // add new columns when reaching the end, in this case
            // the fourth element of the column array (left navigation)
            if (e.activeIndex === 3) {
              const pastFourDays = getPastFourDays(columnStore.dayColumns[0].id)
              columnStore.unshiftColumns(pastFourDays.reverse())
              await syncDayColumns([
                ...pastFourDays.reverse(),
                ...columnStore.dayColumns,
              ])
            }
          }}
          onSlidesLengthChange={(e) => {
            if (e.activeIndex === 3) {
              // jump to the correct day, instead of staying at the newly created column
              swiperRef?.slideTo(7, 0)
            }
          }}
        >
          {columnStore.dayColumns.map((column, index) => {
            let columnTodos
            if (column.order.length === 0) {
              // there are no todos in the column
              columnTodos = null
            } else {
              columnTodos = column.order.map(
                (id) => todoStore.todos.find((todo) => todo.id === id) as ITodo,
              )
            }
            return (
              <SwiperSlide key={column.id}>
                <DayColumn
                  todos={columnTodos}
                  column={column}
                  swiperRef={swiperRef}
                  index={index}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <NavRight
        swiperRef={swiperRef}
        navigationDisabled={navigationDisabled}
        syncDayColumns={syncDayColumns}
      />
    </section>
  )
}
export default CalendarView
