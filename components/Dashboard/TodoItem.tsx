import * as todoService from '@/lib/todo.service'
import update from 'immutability-helper'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
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
  todos: ITodo[]
  setTodos: Dispatch<SetStateAction<ITodo[]>>
  index: number
}

interface DragItem {
  index: number
  id: string
}

const TodoItem = ({ item, todos, setTodos, index }: Props) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    editTodoInputRef.current?.focus()
  }, [isEditing])

  const handleDeleteTodo = async () => {
    console.log(item.id)
    setTodos((prev) => (prev ? prev.filter((el) => el.id !== item.id) : prev))
    await todoService.deleteTodo(user!.uid, item.id)
    todoService.deleteFromListOrder(user!.uid, item.id)
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

  const [{ isDragging }, drag] = useDrag({
    type: 'todo',
    item: () => {
      return { id: item.id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setTodos((prevTodos: ITodo[]) =>
        update(prevTodos, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevTodos[dragIndex] as ITodo],
          ],
        }),
      )
    },
    [setTodos],
  )

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'todo',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(dragged: DragItem, monitor) {
      if (!divRef.current) {
        return
      }
      const dragIndex = dragged.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      console.log(dragged)

      // Determine todo item's vertical center point
      const hoverBoundingRect = divRef.current.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position distance to the top
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height

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

      dragged.index = hoverIndex
    },
    drop() {
      // save order to firestore
      todoService.rearrangeListOrder(
        user!.uid,
        todos.map((todo) => todo.id),
      )
    },
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
  )
}

export default TodoItem
