import { useAuth } from '../AuthContext'
import ListView from './ListView'
import CalendarView from '@/components/Dashboard/CalendarView/'
import * as dayService from '@/lib/day.service'
import * as listService from '@/lib/list.service'
import * as todoService from '@/lib/todo.service'
import useDayStore, { IDayColumn } from '@/stores/days'
import useListStore, { IList } from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import { getInitialColumns } from '@/utils/dateHelper'
import { onDragEndLogic } from '@/utils/onDragEndLogic'
import { useEffect } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

const Dashboard = () => {
  const { user } = useAuth()
  const todoStore = useTodoStore()
  const columnStore = useDayStore()
  const listStore = useListStore()

  const syncDayColumns = async (dayColumns: IDayColumn[]) => {
    const calendarResponse = await dayService.getDayColumnsByIds(
      user!.uid,
      dayColumns.map((day) => day.id),
    )
    const columnFromFirestore = calendarResponse.flat() as IDayColumn[]
    columnStore.syncColumns(columnFromFirestore)
  }

  useEffect(() => {
    async function fetchTodos() {
      const todoResponse = await todoService.getAllTodos(user!.uid)

      const todosMapped = todoResponse.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      todoStore.setTodos(todosMapped as ITodo[])
    }

    async function syncListToFirebase() {
      const [listResponse, listOrderResponse] = await Promise.all([
        listService.getLists(user!.uid),
        listService.getListOrder(user!.uid),
      ])
      const listMapped = listResponse.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      listStore.setLists(listMapped as IList[])
      listStore.setListOrder(listOrderResponse!.data()!.order)
    }
    fetchTodos()
    syncListToFirebase()
    syncDayColumns(getInitialColumns())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDragEnd = async (result: DropResult) => {
    onDragEndLogic(result, user, listStore, columnStore)
  }

  return (
    <main className="flex-auto flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <CalendarView syncDayColumns={syncDayColumns} />
        <ListView />
      </DragDropContext>
    </main>
  )
}

export default Dashboard
