import * as columnService from '@/lib/column.service'
import * as todoService from '@/lib/todo.service'
import {
  checkIsPast,
  checkIsToday,
  getDayOfTheWeek,
  getFullDate,
} from '@/utils/dateHelper'
import update from 'immutability-helper'
import { KeyboardEvent, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import SwiperCore from 'swiper'
import { useAuth } from '../../AuthContext'
import TodoItem, { ITodo } from './TodoItem'
import clsx from 'clsx'

export interface IColumn {
  id: string
  order: string[]
}

interface Props {
  todos: ITodo[] | null
  column: IColumn
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
  setColumns: React.Dispatch<React.SetStateAction<IColumn[]>>
  swiperRef: SwiperCore | undefined
  index: number
}

const Column = ({
  todos,
  column,
  setTodos,
  setColumns,
  index,
  swiperRef,
}: Props) => {
  const { user } = useAuth()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const isToday = checkIsToday(column.id)
  const isPast = checkIsPast(column.id)
  const isRealIndex = index === swiperRef?.realIndex

  const handleAddTodo = async () => {
    const res = await todoService.addTodo(user!.uid, {
      text: newTodoInputValue,
      checked: false,
    })

    setNewTodoInputValue('')

    setColumns((prev) =>
      prev.map((c) =>
        c.id === column.id
          ? update(c, {
              order: {
                $push: [res.id],
              },
            })
          : c,
      ),
    )

    setTodos((prev) =>
      update(prev, {
        $push: [{ id: res.id, text: newTodoInputValue, checked: false }],
      }),
    )

    await columnService.addToOrderList(user!.uid, column.id, res.id)
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
        !isRealIndex && 'border-l border-stone-200',
        'px-4 h-full text-primary flex-grow',
      )}
    >
      <div className="w-full text-center">
        <div className="">
          <h1 className="font-gothic text-6xl md:text-4xl">
            {getDayOfTheWeek(column.id).toUpperCase()}
          </h1>
          <p className="mt-2 font-inter text-xs  ">
            {getFullDate(column.id).toUpperCase()}
          </p>
        </div>
      </div>
      <div className="h-full mt-20 md:mt-4 md:text-sm bg-mobile-horizontal-lines md:bg-md-horizontal-lines">
        <Droppable droppableId={column.id}>
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
                      setTodos={setTodos}
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

export default Column
