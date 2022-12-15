import { useAuth } from '../../AuthContext'
import { getRenderClone } from '../Common/getRenderClone'
import TodoItem from './TodoItem'
import * as dayService from '@/lib/day.service'
import * as todoService from '@/lib/todo.service'
import useDayStore from '@/stores/days'
import { IDayColumn } from '@/stores/days'
import useTodoStore, { ITodo } from '@/stores/todos'
import {
  checkIsPast,
  checkIsToday,
  getDayOfTheWeek,
  getFullDate,
} from '@/utils/dateHelper'
import clsx from 'clsx'
import { KeyboardEvent, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import SwiperCore from 'swiper'

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
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const isToday = checkIsToday(column.id)
  const isPast = checkIsPast(column.id)
  const isColumnOnFarLeft = index === swiperRef?.realIndex
  const renderClone = getRenderClone(todos) // renderClone allows to move todo item to other parent (LIST VIEW) while maintaining the desired drag behavior

  const handleAddTodo = async () => {
    setNewTodoInputValue('')
    const res = await todoService.addTodo(user!.uid, {
      text: newTodoInputValue,
      checked: false,
    })
    columnStore.addTodoToColumn(column.id, res.id)
    todoStore.pushTodo({ id: res.id, text: newTodoInputValue, checked: false })
    await dayService.addTodoToColumn(user!.uid, column.id, res.id)
  }

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleAddTodo()
    }
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
        <h2 className="font-gothic text-6xl md:text-4xl">
          {getDayOfTheWeek(column.id).toUpperCase()}
        </h2>
        <p className="mt-2 font-inter text-xs  ">
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
              {todos &&
                todos.map((item, i) => {
                  if (!item) return
                  return (
                    <TodoItem
                      item={item}
                      index={i}
                      key={item.id}
                      colId={column.id}
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
              />
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default DayColumn
