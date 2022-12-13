import CalendarView from '@/components/Dashboard/CalendarView/'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import useColumnStore, { IColumn } from '@/stores/columns'
import ListView from './ListView'
import * as calendarService from '@/lib/calendar.service'
import * as todoService from '@/lib/todo.service'
import * as listService from '@/lib/list.service'
import { useAuth } from '../AuthContext'
import { useEffect } from 'react'
import useTodoStore, { ITodo } from '@/stores/todos'
import useListStore, { IList } from '@/stores/lists'

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

    const destinationIsList = destination.droppableId.startsWith('list-')
    const sourceIsList = source.droppableId.startsWith('list-')

    let startColumn: IColumn | IList
    let finishColumn: IColumn | IList

    // determine whether or not the destination / source is list or calendar to use the correct store.

    if (sourceIsList) {
      startColumn = listStore.lists.find(
        (list) => list.id === source.droppableId.split('-').pop(),
      ) as IList
    } else {
      startColumn = columnStore.columns.find(
        (col) => col.id === source.droppableId,
      ) as IColumn
    }

    if (destinationIsList) {
      finishColumn = listStore.lists.find(
        (list) => list.id === destination.droppableId.split('-').pop(),
      ) as IList
    } else {
      finishColumn = columnStore.columns.find(
        (col) => col.id === destination.droppableId,
      ) as IColumn
    }

    if (startColumn === finishColumn) {
      // reorder array within the same column
      const newOrder = Array.from(startColumn.order)
      newOrder.splice(source.index, 1)
      newOrder.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startColumn,
        order: newOrder,
      }

      if (destinationIsList) {
        listStore.editList(newColumn.id, newColumn as IList)
        listService.rearrangeTodoOrder(user!.uid, finishColumn.id, newOrder)
      } else {
        columnStore.editColumn(newColumn.id, newColumn)
        calendarService.rearrangeOrder(user!.uid, finishColumn.id, newOrder) // sync to firebase
      }
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

      if (sourceIsList) {
        listStore.editList(startColumn.id, newStartColumn as IList)
        listService.rearrangeTodoOrder(user!.uid, startColumn.id, newStartOrder)
      } else {
        columnStore.editColumn(startColumn.id, newStartColumn)
        calendarService.rearrangeOrder(user!.uid, startColumn.id, newStartOrder)
      }

      if (destinationIsList) {
        listStore.editList(finishColumn.id, newFinishColumn as IList)
        listService.rearrangeTodoOrder(
          user!.uid,
          finishColumn.id,
          newFinishOrder,
        )
      } else {
        columnStore.editColumn(finishColumn.id, newFinishColumn)
        calendarService.rearrangeOrder(
          user!.uid,
          finishColumn.id,
          newFinishOrder,
        )
      }
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
