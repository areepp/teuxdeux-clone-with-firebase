import { useAuth } from '../../AuthContext'
import * as listService from '@/lib/list.service'
import * as todoService from '@/lib/todo.service'
import useListStore from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import { useEffect, useRef, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { HiOutlineX, HiPencil } from 'react-icons/hi'

interface Props {
  item: ITodo
  index: number
  listId: string
}

const TodoItem = ({ item, index, listId }: Props) => {
  const { user } = useAuth()
  const todoStore = useTodoStore()
  const listStore = useListStore()
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    editTodoInputRef.current?.focus()
  }, [isEditing])

  const handleDeleteTodo = async () => {
    todoStore.deleteTodo(item.id)
    listStore.deleteTodoFromList(listId, item.id)
    Promise.all([
      todoService.deleteTodo(user!.uid, item.id),
      listService.deleteTodoFromListOrder(user!.uid, listId, item.id),
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
