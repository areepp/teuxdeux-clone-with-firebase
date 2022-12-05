import * as columnService from '@/lib/column.service'
import * as todoService from '@/lib/todo.service'
import update from 'immutability-helper'
import { KeyboardEvent, useState } from 'react'

import { useAuth } from '../AuthContext'

import { Droppable } from 'react-beautiful-dnd'
import TodoItem, { ITodo } from './TodoItem'
import { getDayOfTheWeek, getFullDate } from '@/utils/dateHelper'

export interface IColumn {
  id: string
  order: string[]
}

interface Props {
  todos: ITodo[] | null
  column: IColumn
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
  setColumns: React.Dispatch<React.SetStateAction<IColumn[]>>
}

const Column = ({ todos, column, setTodos, setColumns }: Props) => {
  const { user } = useAuth()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')

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
    <div className="px-4 h-full flex-grow">
      <div className="w-full text-center">
        <div className=" text-red-600">
          <h1 className="font-gothic text-6xl">
            {getDayOfTheWeek(column.id).toUpperCase()}
          </h1>
          <p className="mt-2 font-inter text-xs  ">
            {getFullDate(column.id).toUpperCase()}
          </p>
        </div>
      </div>
      <div className="mt-20 bg-horizontal-lines min-h-[150px]">
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
                className="h-[49px] flex items-center w-full focus:outline-none bg-transparent"
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
