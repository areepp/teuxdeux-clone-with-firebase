import * as todoService from '@/lib/todo.service'
import * as columnService from '@/lib/column.service'
import { useEffect, useRef, useState } from 'react'
import { HiOutlineX, HiPencil } from 'react-icons/hi'

import { useAuth } from '../../AuthContext'
import { Draggable } from 'react-beautiful-dnd'

export interface ITodo {
  id: string
  text: string
  checked: boolean
}

interface Props {
  item: ITodo
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
  index: number
  colId: string
}

const TodoItem = ({ item, setTodos, index, colId }: Props) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    editTodoInputRef.current?.focus()
  }, [isEditing])

  const handleDeleteTodo = async () => {
    setTodos((prev) => (prev ? prev.filter((el) => el.id !== item.id) : prev))
    await todoService.deleteTodo(user!.uid, item.id)
    columnService.deleteFromOrderList(user!.uid, colId, item.id)
  }

  const handleCheckTodo = async (data: { checked: boolean }) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === item.id ? { ...todo, checked: data.checked } : todo,
      ),
    )
    await todoService.editTodoChecked(user!.uid, item.id, data)
  }

  const handleOnBlur = async (data: { text: string }) => {
    setIsEditing(false)
    await todoService.editTodoText(user!.uid, item.id, data)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      editTodoInputRef.current?.blur()
      await todoService.editTodoText(user!.uid, item.id, { text: item.text })
    }
  }

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`h-[49px] md:h-[27px] flex items-center justify-between cursor-grab drag-fix`} // drag-fix class is used to fix the dragged item not inline with cursor issue
        >
          {isEditing ? (
            <input
              ref={editTodoInputRef}
              className="h-full flex items-center w-full focus:outline-none bg-transparent"
              type="text"
              value={item.text}
              onChange={(e) =>
                setTodos((todos) =>
                  todos.map((todo) =>
                    todo.id === item.id
                      ? { ...todo, text: e.target.value }
                      : todo,
                  ),
                )
              }
              onBlur={() => handleOnBlur({ text: item.text })}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center ${
                item.checked ? 'line-through  text-stone-300' : ''
              }`}
              onClick={() => handleCheckTodo({ checked: !item.checked })}
            >
              {item.text}
            </div>
          )}
          {item.checked ? (
            <button onClick={() => handleDeleteTodo()}>
              <HiOutlineX />
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)}>
              <HiPencil />
            </button>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default TodoItem