import { addTodo, getTodos } from '@/lib/todoService'
import { QuerySnapshot } from 'firebase/firestore'
import { useState, KeyboardEvent, useEffect, useCallback } from 'react'
import { useAuth } from '../AuthContext'
import update from 'immutability-helper'

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
      text: newTodoInputValue,
      checked: false,
    })
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

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setTodos((prevTodos: ITodo[]) =>
      update(prevTodos, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevTodos[dragIndex] as ITodo],
        ],
      }),
    )
  }, [])

  const renderTodoItem = useCallback(
    (item: ITodo, index: number) => {
      return (
        <TodoItem
          key={item.id}
          index={index}
          setTodos={setTodos}
          item={item}
          moveCard={moveCard}
        />
      )
    },
    [moveCard],
  )

  return (
    <div className="mt-12 h-full flex-grow bg-horizontal-lines">
      {todos.map((item, i) => renderTodoItem(item, i))}
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
