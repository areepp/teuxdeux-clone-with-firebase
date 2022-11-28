import * as todoService from '@/lib/todo.service'
import * as columnService from '@/lib/column.service'
import { useState, KeyboardEvent, useEffect } from 'react'
import { useAuth } from '../AuthContext'

import TodoItem, { ITodo } from './TodoItem'

const Column = ({ colId }: { colId: string }) => {
  const { user } = useAuth()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const [todos, setTodos] = useState<ITodo[]>([])

  // QuerySnapshot<ITodo>
  useEffect(() => {
    async function fetchData() {
      const listResponse = await columnService.getColumn(user!.uid, colId)

      if (listResponse.data()?.order[0] === '') {
        // there is no todo in this column
        setTodos([])
      } else {
        const todosResponse = await todoService.getColumnTodos(
          user!.uid,
          listResponse.data()?.order,
        )

        // get the actual data
        const todos = todosResponse.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))

        const todoOrder = listResponse.data()?.order

        const todosSorted = todos.sort(
          (a, b) => todoOrder.indexOf(a.id) - todoOrder.indexOf(b.id),
        )

        setTodos(todosSorted as ITodo[])
      }
    }

    fetchData()
  }, [user, colId])

  const handleAddTodo = async () => {
    const res = await todoService.addTodo(user!.uid, {
      text: newTodoInputValue,
      checked: false,
    })

    await columnService.addToOrderList(user!.uid, colId, res.id)

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
    <div className="mt-12 h-full flex-grow">
      <div className="w-full text-center">
        <div className="font-gothic text-6xl text-red-600">THURSDAY</div>
      </div>
      <div className="bg-horizontal-lines">
        {todos.map((item, i) => (
          <TodoItem
            item={item}
            todos={todos}
            setTodos={setTodos}
            index={i}
            colId={colId}
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
    </div>
  )
}

export default Column
