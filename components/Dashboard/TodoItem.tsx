import { deleteTodo, editTodo, editTodoChecked } from '@/lib/todoService'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { HiOutlineX, HiPencil } from 'react-icons/hi'

import { useAuth } from '../AuthContext'

export interface ITodo {
  id: string
  todo: string
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

  const handleDeleteTodo = async (deletedTodoId: string) => {
    await deleteTodo(user!.uid, deletedTodoId)
    setTodos((prev) =>
      prev ? prev.filter((el) => el.id !== deletedTodoId) : prev,
    )
  }

  const handleCheckTodo = async (
    todoId: string,
    data: { checked: boolean },
  ) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, checked: data.checked } : todo,
      ),
    )
    await editTodoChecked(user!.uid, todoId, data)
  }

  const handleOnBlur = async (todoId: string, data: { todo: string }) => {
    setIsEditing(false)
    await editTodo(user!.uid, todoId, data)
  }

  return (
    <div className="h-[49px] flex items-center justify-between" key={item.id}>
      {isEditing ? (
        <input
          ref={editTodoInputRef}
          className="h-[49px] flex items-center w-full focus:outline-none bg-transparent"
          type="text"
          value={item.todo}
          onChange={(e) =>
            setTodos((todos) =>
              todos.map((todo) =>
                todo.id === item.id ? { ...todo, todo: e.target.value } : todo,
              ),
            )
          }
          onBlur={() => handleOnBlur(item.id, { todo: item.todo })}
        />
      ) : (
        <div
          className={`w-full cursor-grab ${
            item.checked ? 'line-through text-stone-300' : ''
          }`}
          onClick={() => handleCheckTodo(item.id, { checked: !item.checked })}
        >
          {item.todo}
        </div>
      )}
      {item.checked ? (
        <button onClick={() => handleDeleteTodo(item.id)}>
          <HiOutlineX />
        </button>
      ) : (
        <button
          onClick={() => {
            setIsEditing(true)
          }}
        >
          <HiPencil />
        </button>
      )}
    </div>
  )
}

export default TodoItem
