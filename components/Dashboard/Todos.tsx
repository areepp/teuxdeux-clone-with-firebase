import {
  addTodo,
  deleteTodo,
  editTodoChecked,
  getTodos,
  editTodo,
} from '@/lib/todoService'
import { QuerySnapshot } from 'firebase/firestore'
import { useState, KeyboardEvent, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { HiOutlineX, HiPencil } from 'react-icons/hi'

export interface ITodo {
  id: string
  todo: string
  checked: boolean
}

const Todos = () => {
  const { user } = useAuth()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const [todos, setTodos] = useState<ITodo[] | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const response = (await getTodos(user!.uid)) as QuerySnapshot<ITodo>
      setTodos(response.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    fetchData()
  }, [user])

  const handleDeleteTodo = async (deletedTodoId: string) => {
    await deleteTodo(user!.uid, deletedTodoId)
    setTodos((prev) =>
      prev ? prev.filter((el) => el.id !== deletedTodoId) : prev,
    )
  }

  const handleAddTodo = async () => {
    const res = await addTodo(user!.uid, {
      todo: newTodoInputValue,
      checked: false,
    })
    setTodos((prev) =>
      prev
        ? [...prev, { id: res.id, todo: newTodoInputValue, checked: false }]
        : [{ id: res.id, todo: newTodoInputValue, checked: false }],
    )
    setNewTodoInputValue('')
  }

  const handleCheckTodo = async (
    todoId: string,
    data: { checked: boolean },
  ) => {
    setTodos((todos) =>
      todos
        ? todos?.map((todo) =>
            todo.id === todoId ? { ...todo, checked: data.checked } : todo,
          )
        : null,
    )
    await editTodoChecked(user!.uid, todoId, data)
  }

  const handleEditTodo = async (todoId: string, data: { todo: string }) => {
    await editTodo(user!.uid, todoId, data)
  }

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleAddTodo()
    }
  }

  return (
    <div className="mt-12 h-full flex-grow bg-horizontal-lines">
      {todos &&
        todos.map((item) => (
          <div
            className="h-[49px] flex items-center justify-between"
            key={item.id}
          >
            {isEditing ? (
              <input
                type="text"
                value={item.todo}
                onChange={(e) =>
                  setTodos((todos) =>
                    todos
                      ? todos.map((todo) =>
                          todo.id === item.id
                            ? { ...todo, todo: e.target.value }
                            : todo,
                        )
                      : null,
                  )
                }
                onBlur={() => handleEditTodo(item.id, { todo: item.todo })}
              />
            ) : (
              <div
                className={`w-full cursor-grab ${
                  item.checked ? 'line-through text-stone-300' : ''
                }`}
                onClick={() =>
                  handleCheckTodo(item.id, { checked: !item.checked })
                }
              >
                {item.todo}
              </div>
            )}
            {item.checked ? (
              <button onClick={() => handleDeleteTodo(item.id)}>
                <HiOutlineX />
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <HiPencil />
              </button>
            )}
          </div>
        ))}
      <input
        className="h-[49px] flex items-center w-full focus:outline-none bg-transparent"
        type="text"
        value={newTodoInputValue}
        onChange={(e) => setNewTodoInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}

export default Todos
