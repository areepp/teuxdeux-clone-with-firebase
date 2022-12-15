import Column from './Column'
import NavLeft from './NavLeft'
import NavRight from './NavRight'
import useColumnStore from '@/stores/columns'
import { IColumn } from '@/stores/columns'
import { ITodo } from '@/stores/todos'
import useTodoStore from '@/stores/todos'
import {
  getInitialColumns,
  getNextFourDays,
  getPastFourDays,
} from '@/utils/dateHelper'
import { useEffect, useState } from 'react'
import SwiperCore from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

interface Props {
  syncDayColumns: (_dayColumns: IColumn[]) => Promise<void>
}

const CalendarView = ({ syncDayColumns }: Props) => {
  const columnStore = useColumnStore()
  const todoStore = useTodoStore()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>()
  const [navigationDisabled, setNavigationDisabled] = useState(false)

  useEffect(() => {
    syncDayColumns(getInitialColumns())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="relative bg-white flex-grow min-h-[500px] pt-12 md:flex">
      <NavLeft
        swiperRef={swiperRef}
        navigationDisabled={navigationDisabled}
        syncDayColumns={syncDayColumns}
      />
      <div className="h-full md:w-main">
        <Swiper
          className="h-full"
          onSwiper={setSwiperRef}
          initialSlide={7} // initial set to current day
          slidesPerView={1}
          allowTouchMove={false}
          speed={600}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
          onSlideChangeTransitionStart={() => setNavigationDisabled(true)}
          onSlideChangeTransitionEnd={() => setNavigationDisabled(false)}
          onTransitionEnd={async (e) => {
            if (e.activeIndex === columnStore.columns.length - 4) {
              const nextFourDays = getNextFourDays(
                columnStore.columns[columnStore.columns.length - 1].id,
              )
              columnStore.pushColumns(nextFourDays)
              await syncDayColumns([...columnStore.columns, ...nextFourDays])
            }
            if (e.activeIndex === 3) {
              const pastFourDays = getPastFourDays(columnStore.columns[0].id)
              columnStore.unshiftColumns(pastFourDays.reverse())
              await syncDayColumns([
                ...pastFourDays.reverse(),
                ...columnStore.columns,
              ])
            }
          }}
          onSlidesLengthChange={(e) => {
            if (e.activeIndex === 3) {
              swiperRef?.slideTo(7, 0)
            }
          }}
        >
          {columnStore.columns.map((column, index) => {
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
                <Column
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
