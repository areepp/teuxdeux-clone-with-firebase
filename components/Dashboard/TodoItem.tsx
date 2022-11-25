import { ItemTypes } from '@/data/ItemTypes'
import { deleteTodo, editTodo, editTodoChecked } from '@/lib/todoService'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { HiOutlineX, HiPencil } from 'react-icons/hi'

import { useAuth } from '../AuthContext'

import type { Identifier, XYCoord } from 'dnd-core'

export interface ITodo {
  id: string
  text: string
  checked: boolean
}

interface Props {
  item: ITodo
  setTodos: Dispatch<SetStateAction<ITodo[]>>
  index: number
  moveCard: (_dragIndex: number, _hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const TodoItem = ({ item, setTodos, index, moveCard }: Props) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    editTodoInputRef.current?.focus()
  }, [isEditing])

  const handleDeleteTodo = async () => {
    await deleteTodo(user!.uid, item.id)
    setTodos((prev) => (prev ? prev.filter((el) => el.id !== item.id) : prev))
  }

  const handleCheckTodo = async (data: { checked: boolean }) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === item.id ? { ...todo, checked: data.checked } : todo,
      ),
    )
    await editTodoChecked(user!.uid, item.id, data)
  }

  const handleOnBlur = async (data: { text: string }) => {
    setIsEditing(false)
    await editTodo(user!.uid, item.id, data)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      editTodoInputRef.current?.blur()
      await editTodo(user!.uid, item.id, { text: item.text })
    }
  }

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.TODO,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!divRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = divRef.current.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: () => {
      return { id: item.id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(divRef))

  return (
    <div
      ref={divRef}
      className={`h-[49px] flex items-center justify-between cursor-grab ${
        isDragging ? 'opacity-0' : 'opacity-1'
      }`}
      data-handler-id={handlerId}
    >
      {isEditing ? (
        <input
          ref={editTodoInputRef}
          className="h-[49px] flex items-center w-full focus:outline-none bg-transparent"
          type="text"
          value={item.text}
          onChange={(e) =>
            setTodos((todos) =>
              todos.map((todo) =>
                todo.id === item.id ? { ...todo, text: e.target.value } : todo,
              ),
            )
          }
          onBlur={() => handleOnBlur({ text: item.text })}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          className={`w-full${
            item.checked ? 'line-through text-stone-300' : ''
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
  )
}

export default TodoItem
