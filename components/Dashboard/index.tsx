import { useEffect } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import CalendarView from '@/components/Dashboard/CalendarView/'
import { getInitialColumns } from '@/helper/dateHelper'
import { onDragEndLogic } from '@/helper/onDragEndLogic'
import * as dayService from '@/lib/day.service'
import * as listService from '@/lib/list.service'
import * as todoService from '@/lib/todo.service'
import useListStore, { IList } from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import useDayStore from '@/stores/days'
import useSettingStore from '@/stores/settings'
import { IDayColumn } from '@/types/IDayColumn'
import { useAuth } from '../AuthContext'
import ListView from './ListView'
import Setting from './Common/Setting'

const Dashboard = () => {
  const { user } = useAuth()
  const todoStore = useTodoStore()
  const columnStore = useDayStore()
  const listStore = useListStore()
  const settingStore = useSettingStore()

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

      if (listMapped.length === 0 || !listOrderResponse.data()) {
        return
      }

      listStore.setLists(listMapped as IList[])
      listStore.setListOrder(listOrderResponse!.data()!.order)
    }
    fetchTodos()
    syncListToFirebase()
    syncDayColumns(getInitialColumns())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        settingStore.setSlidesPerView(1)
      } else {
        settingStore.setSlidesPerView(settingStore.slidesPerViewBigScreen)
      }
    }
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [settingStore])

  const onDragEnd = async (result: DropResult) => {
    onDragEndLogic(result, user, listStore, columnStore)
  }

  return (
    <main className="flex-auto flex flex-col">
      <Setting />
      <DragDropContext onDragEnd={onDragEnd}>
        <CalendarView syncDayColumns={syncDayColumns} />
        <ListView />
      </DragDropContext>
    </main>
  )
}

export default Dashboard
