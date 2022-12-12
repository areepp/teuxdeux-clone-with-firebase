import CalendarView from '@/components/Dashboard/CalendarView/'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import useColumnStore, { IColumn } from '@/stores/columns'
import ListView from './ListView'
import * as calendarService from '@/lib/calendar.service'
import * as todoService from '@/lib/todo.service'
import { useAuth } from '../AuthContext'
import { useEffect } from 'react'
import useTodoStore, { ITodo } from '@/stores/todos'
import useListStore from '@/stores/lists'

const Dashboard = () => {
  const { user } = useAuth()
  const todoStore = useTodoStore()
  const columnStore = useColumnStore()
  const listStore = useListStore()

  useEffect(() => {
    async function fetchData() {
      const todoResponse = await todoService.getAllTodos(user!.uid)

      const todosMapped = todoResponse.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      todoStore.setTodos(todosMapped as ITodo[])
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result

    if (!destination) return

    if (type === 'list') {
      const newListOrder = Array.from(listStore.listOrder)
      newListOrder.splice(source.index, 1)
      newListOrder.splice(destination.index, 0, draggableId)

      listStore.setListOrder(newListOrder)
      return
    }

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
      calendarService.rearrangeOrder(user!.uid, finishColumn.id, newOrder)
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
      calendarService.rearrangeOrder(user!.uid, startColumn.id, newStartOrder)
      calendarService.rearrangeOrder(user!.uid, finishColumn.id, newFinishOrder)
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
