import CalendarView from '@/components/Dashboard/CalendarView/'
import { getInitialDays } from '@/utils/dateHelper'
import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { IColumn } from './CalendarView/Column'
import ListView from './ListView'

const Dashboard = () => {
  const [columns, setColumns] = useState<IColumn[]>(getInitialDays())

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
      // columnService.rearrangeOrder(user!.uid, finishColumn.id, newOrder)
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
      // columnService.rearrangeOrder(user!.uid, startColumn.id, newStartOrder)
      // columnService.rearrangeOrder(user!.uid, finishColumn.id, newFinishOrder)
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <CalendarView columns={columns} setColumns={setColumns} />
        <ListView />
      </DragDropContext>
    </>
  )
}

export default Dashboard
