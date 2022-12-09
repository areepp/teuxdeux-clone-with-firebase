import CalendarView from '@/components/Dashboard/CalendarView/'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { IColumn } from '@/stores/columns'
import ListView from './ListView'
import * as columnService from '@/lib/column.service'
import { useAuth } from '../AuthContext'
import useColumnStore from '@/stores/columns'

const Dashboard = () => {
  const { user } = useAuth()
  const columnStore = useColumnStore()

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

    const startColumn = columnStore.columns.find(
      (col) => col.id === source.droppableId,
    ) as IColumn
    const finishColumn = columnStore.columns.find(
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

      columnStore.editColumn(newColumn.id, newColumn)

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

      columnStore.editColumn(startColumn.id, newStartColumn)
      columnStore.editColumn(finishColumn.id, newFinishColumn)

      // sync to firebase
      columnService.rearrangeOrder(user!.uid, startColumn.id, newStartOrder)
      columnService.rearrangeOrder(user!.uid, finishColumn.id, newFinishOrder)
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <CalendarView />
        <ListView />
      </DragDropContext>
    </>
  )
}

export default Dashboard
