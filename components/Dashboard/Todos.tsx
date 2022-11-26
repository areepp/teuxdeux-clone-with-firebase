import { addTodo, addToListOrder, getList, getTodos } from '@/lib/todoService'
import { useState, KeyboardEvent, useEffect } from 'react'
import { useAuth } from '../AuthContext'

import TodoItem, { ITodo } from './TodoItem'

const Todos = () => {
  const { user } = useAuth()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const [todos, setTodos] = useState<ITodo[]>([])

  // QuerySnapshot<ITodo>
  useEffect(() => {
    async function fetchData() {
      const [todoResponse, listResponse] = await Promise.all([
        getTodos(user!.uid),
        getList(user!.uid),
      ])

      const todos = todoResponse.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      const todoOrder = listResponse.data()?.order

      const todosSorted = todos.sort(
        (a, b) => todoOrder.indexOf(a.id) - todoOrder.indexOf(b.id),
      )

      setTodos(todosSorted as ITodo[])
    }

    fetchData()
  }, [user])

  const handleAddTodo = async () => {
    const res = await addTodo(user!.uid, {
      text: newTodoInputValue,
      checked: false,
    })

    await addToListOrder(user!.uid, res.id)

    setTodos((prev) =>
      prev
        ? [...prev, { id: res.id, text: newTodoInputValue, checked: false }]
        : [{ id: res.id, text: newTodoInputValue, checked: false }],
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
      {todos.map((item, i) => (
        <TodoItem
          item={item}
          todos={todos}
          setTodos={setTodos}
          index={i}
          key={item.id}
        />
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
