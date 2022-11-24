import { addTodo, getTodos } from '@/lib/todoService'
import { QuerySnapshot } from 'firebase/firestore'
import { useState, KeyboardEvent, useEffect } from 'react'
import { useAuth } from '../AuthContext'

import TodoItem, { ITodo } from './TodoItem'

const Todos = () => {
  const { user } = useAuth()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const [todos, setTodos] = useState<ITodo[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = (await getTodos(user!.uid)) as QuerySnapshot<ITodo>
      setTodos(response.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    fetchData()
  }, [user])

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

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleAddTodo()
    }
  }

  return (
    <div className="mt-12 h-full flex-grow bg-horizontal-lines">
      {todos.map((item) => (
        <TodoItem item={item} setTodos={setTodos} key={item.id} />
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
