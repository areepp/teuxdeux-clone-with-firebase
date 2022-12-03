import * as columnService from '@/lib/column.service'
import * as todoService from '@/lib/todo.service'
import { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useAuth } from '../AuthContext'
import Column, { IColumn } from './Column'
import { ITodo } from './TodoItem'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Navigation from './Navigation'

import {
  getInitialDays,
  getNextFourDays,
  getPastFourDays,
} from '@/utils/dateHelper'

const CalendarView = () => {
  const { user } = useAuth()

  const [columns, setColumns] = useState<IColumn[]>(getInitialDays())
  const [todos, setTodos] = useState<ITodo[]>([])
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 7, // initial slide set to today
    drag: false,
    renderMode: 'performance',
    slides: {
      number: 1000,
    },
    slideChanged(slider) {
      if (slider.track.details.rel === slider.slides.length - 3) {
        instanceRef?.current?.update({
          slides: {
            number: columns.length + 4,
          },
        })

        const nextFourDays = getNextFourDays(columns[columns.length - 1].id)
        setColumns((prev) => [...prev, ...nextFourDays])
      } else if (slider.track.details.rel === 2) {
        instanceRef?.current?.update(
          {
            slides: {
              number: columns.length + 4,
            },
          },
          6,
        )
        const pastFourDays = getPastFourDays(columns[0].id)
        setColumns((prev) => [...pastFourDays.reverse(), ...prev])
      }
    },
  })

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
    <main className="min-h-[575px] py-12">
      <Navigation instanceRef={instanceRef} />
      <div className="md:hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {columns.map((column, index) => {
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
                  <div
                    className={`keen-slider__slide number-slide${index + 1}`}
                    key={column.id}
                  >
                    <Column
                      todos={columnTodos}
                      setTodos={setTodos}
                      column={column}
                      setColumns={setColumns}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </DragDropContext>
      </div>
      <div className="hidden md:block">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="hidden md:grid grid-cols-3 gap-4">
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
                <Column
                  key={column.id}
                  column={column}
                  setColumns={setColumns}
                  todos={columnTodos}
                  setTodos={setTodos}
                />
              )
            })}
          </div>
        </DragDropContext>
      </div>
    </main>
  )
}

export default CalendarView
