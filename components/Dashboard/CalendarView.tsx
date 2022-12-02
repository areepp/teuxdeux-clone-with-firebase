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

import COLUMN_DATA from '@/data/columns.json'

const CalendarView = () => {
  const { user } = useAuth()
  const [columns, setColumns] = useState<IColumn[]>(COLUMN_DATA.columns)
  const [todos, setTodos] = useState<ITodo[]>([])
  const [, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    drag: false,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  console.log(columns)

  // useEffect(() => {
  //   async function fetchData() {
  //     const [columnResponse, todoResponse] = await Promise.all([
  //       columnService.getAllColumn(user!.uid),
  //       todoService.getAllTodos(user!.uid),
  //     ])

  //     setColumns(
  //       columnResponse.docs.map((col) => ({
  //         ...col.data(),
  //         id: col.id,
  //       })) as IColumn[],
  //     )

  //     setTodos(
  //       todoResponse.docs.map((doc) => ({
  //         ...doc.data(),
  //         id: doc.id,
  //       })) as ITodo[],
  //     )
  //   }

  //   fetchData()
  // }, [user])

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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="relative md:hidden">
          <div ref={sliderRef} className="keen-slider">
            {columns.map((column, index) => (
              <div
                className={`keen-slider__slide number-slide${index}`}
                key={column.id}
              >
                <Column
                  todos={todos}
                  setTodos={setTodos}
                  column={column}
                  setColumns={setColumns}
                />
              </div>
            ))}
          </div>
        </div>
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
    </main>
  )
}

export default CalendarView