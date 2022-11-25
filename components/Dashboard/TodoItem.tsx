import { deleteTodo, editTodo, editTodoChecked } from '@/lib/todoService'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { HiOutlineX, HiPencil } from 'react-icons/hi'

import { useAuth } from '../AuthContext'

export interface ITodo {
  id: string
  text: string
  checked: boolean
}

interface Props {
  item: ITodo
  setTodos: Dispatch<SetStateAction<ITodo[]>>
}

const TodoItem = ({ item, setTodos }: Props) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)

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

  return (
    <div className="h-[49px] flex items-center justify-between" key={item.id}>
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
          className={`w-full cursor-grab ${
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
