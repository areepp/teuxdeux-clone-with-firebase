import clsx from 'clsx'
import { KeyboardEvent, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import SwiperCore from 'swiper'
import { v4 as uuidv4 } from 'uuid'
import {
  checkIsPast,
  checkIsToday,
  getDayOfTheWeek,
  getFullDate,
} from '@/helper/dateHelper'
import * as dayService from '@/lib/day.service'
import * as todoService from '@/lib/todo.service'
import useDayStore from '@/stores/days'
import useTodoStore, { ITodo } from '@/stores/todos'
import useSettingStore from '@/stores/settings'
import { IDayColumn } from '@/types/IDayColumn'
import { useAuth } from '../../AuthContext'
import TodoItem from '../Common/TodoItem'
import { getRenderClone } from '../Common/getRenderClone'

interface Props {
  todos: ITodo[] | null
  column: IDayColumn
  swiperRef: SwiperCore | undefined
  index: number
}

const DayColumn = ({ todos, column, index, swiperRef }: Props) => {
  const { user } = useAuth()
  const columnStore = useDayStore()
  const todoStore = useTodoStore()
  const settingStore = useSettingStore()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const isToday = checkIsToday(column.id)
  const isPast = checkIsPast(column.id)
  const isColumnOnFarLeft = index === swiperRef?.realIndex
  const renderClone = getRenderClone(todos)
  // renderClone allows to move todo item to other parent
  // (ex.CALENDAR VIEW -> LIST VIEW) while maintaining the desired drag behavior

  const handleAddTodo = async () => {
    setNewTodoInputValue('')
    const newTodoId = uuidv4()

    columnStore.addTodoToColumn(column.id, newTodoId)
    todoStore.pushTodo({
      id: newTodoId,
      text: newTodoInputValue,
      checked: false,
    })

    Promise.all([
      todoService.addTodo(user!.uid, newTodoId, {
        text: newTodoInputValue,
        checked: false,
      }),
      dayService.addTodoToColumn(user!.uid, column.id, newTodoId),
    ])
  }

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleAddTodo()
    }
  }

  const handleInputBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      return
    }
    await handleAddTodo()
  }

  return (
    <div
      className={clsx(
        isPast && 'text-stone-300',
        isToday && 'text-primary',
        !isPast && !isToday && 'text-gray-900',
        !isColumnOnFarLeft && 'border-l border-stone-200',
        'px-4 h-full flex-grow',
      )}
    >
      {/* HEADER */}
      <div className="w-full text-center">
        <h2
          className={clsx(
            'font-gothic text-6xl md:text-4xl',
            settingStore.slidesPerView === 7 && 'md:text-2xl lg:text-4xl',
          )}
        >
          {getDayOfTheWeek(column.id).toUpperCase()}
        </h2>
        <p className="mt-2 font-inter text-xs">
          {getFullDate(column.id).toUpperCase()}
        </p>
      </div>

      {/* TODOS */}
      <div className="h-full mt-20 md:mt-4 md:text-sm bg-mobile-horizontal-lines md:bg-md-horizontal-lines">
        <Droppable
          droppableId={column.id}
          type="todo"
          renderClone={renderClone}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {/* eslint-disable-next-line operator-linebreak */}
              {todos &&
                todos.map((item, i) => {
                  if (!item) return undefined
                  return (
                    <TodoItem
                      item={item}
                      index={i}
                      key={item.id}
                      colId={column.id}
                      childOf="calendar"
                    />
                  )
                })}
              {provided.placeholder}
              <input
                className="h-[49px] text-gray-900 md:h-[27px] flex items-center w-full focus:outline-none bg-transparent"
                type="text"
                value={newTodoInputValue}
                onChange={(e) => setNewTodoInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
              />
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default DayColumn
