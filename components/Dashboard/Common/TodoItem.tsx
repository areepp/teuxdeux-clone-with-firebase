import { useAuth } from '../../AuthContext'
import * as listService from '@/lib/list.service'
import * as todoService from '@/lib/todo.service'
import useDayStore from '@/stores/days'
import useListStore from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import { useEffect, useRef, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { HiOutlineX, HiPencil } from 'react-icons/hi'

interface Props {
  item: ITodo
  index: number
  colId: string
  childOf: 'calendar' | 'list'
}

const TodoItem = ({ item, index, colId, childOf }: Props) => {
  const { user } = useAuth()
  const todoStore = useTodoStore()
  const listStore = useListStore()
  const dayStore = useDayStore()
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    editTodoInputRef.current?.focus()
  }, [isEditing])

  const handleDeleteTodo = async () => {
    todoStore.deleteTodo(item.id)

    if (childOf === 'calendar') {
      dayStore.deleteTodoFromColumn(colId, item.id)
    } else {
      listStore.deleteTodoFromList(colId, item.id)
    }

    Promise.all([
      todoService.deleteTodo(user!.uid, item.id),
      listService.deleteTodoFromList(user!.uid, colId, item.id),
    ])
  }

  const handleCheckTodo = async (data: { checked: boolean }) => {
    todoStore.editTodoChecked(item.id, data.checked)
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
          className={`z-50 h-[49px] md:h-[27px] flex items-center justify-between drag-fix`} // drag-fix class is used to fix the dragged item not inline with cursor issue
        >
          {isEditing ? (
            <input
              ref={editTodoInputRef}
              className="h-full flex items-center w-full focus:outline-none bg-transparent"
              type="text"
              value={item.text}
              onChange={(e) => todoStore.editTodoText(item.id, e.target.value)}
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
