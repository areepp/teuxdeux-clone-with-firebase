import * as columnService from '@/lib/column.service'
import * as todoService from '@/lib/todo.service'
import {
  getInitialDays,
  getNextFourDays,
  getPastFourDays,
} from '@/utils/dateHelper'
import { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import SwiperCore from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useAuth } from '../AuthContext'
import Column, { IColumn } from './Column'
import NavLeft from './NavLeft'
import NavRight from './NavRight'
import { ITodo } from './TodoItem'

const CalendarView = () => {
  const { user } = useAuth()

  const [columns, setColumns] = useState<IColumn[]>(getInitialDays())
  const [todos, setTodos] = useState<ITodo[]>([])
  const [swiperRef, setSwiperRef] = useState<SwiperCore>()
  const [navigationDisabled, setNavigationDisabled] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const initialDays = getInitialDays()
      const [columnResponse, todoResponse] = await Promise.all([
        columnService.getColumnByIds(
          user!.uid,
          initialDays.map((day) => day.id),
        ),
        todoService.getAllTodos(user!.uid),
      ])

      const columnFromFirestore = columnResponse.flat() as IColumn[]

      setColumns((initialColumns) =>
        initialColumns.map(
          (initial) =>
            columnFromFirestore.find((fire) => fire.id === initial.id) ||
            initial,
        ),
      )

      setTodos(
        todoResponse.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as ITodo[],
      )
    }

    fetchData()
  }, [user])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    // do nothing if the position of the dragged item is not changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const startColumn = columns.find(
      (col) => col.id === source.droppableId,
    ) as IColumn
    const finishColumn = columns.find(
      (col) => col.id === destination.droppableId,
    ) as IColumn

    if (startColumn === finishColumn) {
      // reorder array within the same column
      const newOrder = Array.from(startColumn.order)
      newOrder.splice(source.index, 1)
      newOrder.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startColumn,
        order: newOrder,
      }

      setColumns((prev) =>
        prev.map((el) => (el.id === newColumn.id ? newColumn : el)),
      )

      // sync to firebase
      columnService.rearrangeOrder(user!.uid, finishColumn.id, newOrder)
    } else {
      // move todo from one column to another
      const newStartOrder = Array.from(startColumn.order)
      newStartOrder.splice(source.index, 1)

      const newStartColumn = {
        ...startColumn,
        order: newStartOrder,
      }

      const newFinishOrder = Array.from(finishColumn.order)
      newFinishOrder.splice(destination.index, 0, draggableId)

      const newFinishColumn = {
        ...finishColumn,
        order: newFinishOrder,
      }

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === startColumn.id) {
            return newStartColumn
          } else if (col.id === finishColumn.id) {
            return newFinishColumn
          } else {
            return col
          }
        }),
      )

      // sync to firebase
      columnService.rearrangeOrder(user!.uid, startColumn.id, newStartOrder)
      columnService.rearrangeOrder(user!.uid, finishColumn.id, newFinishOrder)
    }
  }

  return (
    <main className="relative flex-auto pt-12 md:flex">
      <NavLeft swiperRef={swiperRef} navigationDisabled={navigationDisabled} />
      <div className="h-full md:w-main">
        <DragDropContext onDragEnd={onDragEnd}>
          <Swiper
            className="h-full"
            onSwiper={setSwiperRef}
            initialSlide={7}
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
            onTransitionEnd={(e) => {
              if (e.activeIndex === columns.length - 4) {
                const nextFourDays = getNextFourDays(
                  columns[columns.length - 1].id,
                )
                setColumns((prev) => [...prev, ...nextFourDays])
              }
              if (e.activeIndex === 3) {
                const pastFourDays = getPastFourDays(columns[0].id)
                setColumns((prev) => [...pastFourDays.reverse(), ...prev])
              }
            }}
            onSlidesLengthChange={(e) => {
              if (e.activeIndex === 3) {
                swiperRef?.slideTo(7, 0)
              }
            }}
          >
            {columns.map((column) => {
              let columnTodos
              if (column.order.length === 0) {
                // there are no todos in the column
                columnTodos = null
              } else {
                columnTodos = column.order.map(
                  (id) => todos.find((todo) => todo.id === id) as ITodo,
                )
              }
              return (
                <SwiperSlide key={column.id}>
                  <Column
                    todos={columnTodos}
                    setTodos={setTodos}
                    column={column}
                    setColumns={setColumns}
                  />
                </SwiperSlide>
              )
            })}
          </Swiper>
        </DragDropContext>
      </div>
      <NavRight swiperRef={swiperRef} navigationDisabled={navigationDisabled} />
    </main>
  )
}

export default CalendarView
