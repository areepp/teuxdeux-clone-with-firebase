import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { HiOutlineX, HiPencil } from 'react-icons/hi'
import * as dayService from '@/lib/day.service'
import * as listService from '@/lib/list.service'
import * as todoService from '@/lib/todo.service'
import useDayStore from '@/stores/days'
import useListStore from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import { useAuth } from '../../AuthContext'

interface Props {
  item: ITodo
  index: number
  colId: string
  childOf: 'calendar' | 'list'
}

const TodoItem = ({ item, index, colId, childOf }: Props) => {
  const { user } = useAuth()
  const todoStore = useTodoStore()
  const dayStore = useDayStore()
  const listStore = useListStore()
  const [isEditing, setIsEditing] = useState(false)
  const editTodoInputRef = useRef<HTMLInputElement>(null)
  const [isHovered, setIsHovered] = useState(false)

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

    if (childOf === 'calendar') {
      Promise.all([
        todoService.deleteTodo(user!.uid, item.id),
        dayService.deleteTodoFromColumn(user!.uid, colId, item.id),
      ])
    } else {
      Promise.all([
        todoService.deleteTodo(user!.uid, item.id),
        listService.deleteTodoFromList(user!.uid, colId, item.id),
      ])
    }
  }

  const handleCheckTodo = async (data: { checked: boolean }) => {
    todoStore.editTodoChecked(item.id, data.checked)
    await todoService.editTodoChecked(user!.uid, item.id, data)
  }

  const handleCheckTodoKeyDown = async (
    e: React.KeyboardEvent,
    data: { checked: boolean },
  ) => {
    if (e.key === 'Enter') {
      await handleCheckTodo(data)
    }
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={clsx(
            'relative w-full h-[49px] md:h-[27px] drag-fix',
            isHovered && 'z-50',
            !isHovered && 'z-40',
          )} // drag-fix class is used to fix the dragged item not inline with cursor issue
        >
          <div
            className={clsx(
              'absolute top-0 w-full flex items-center justify-between',
              isEditing && 'bg-transparent h-full',
              isHovered && 'min-h-full h-fit bg-red-100',
              !isHovered && 'h-full',
            )}
          >
            {isEditing ? (
              <input
                ref={editTodoInputRef}
                className="h-full flex-auto focus:outline-none bg-transparent"
                type="text"
                value={item.text}
                // prettier-ignore
                onChange={(e) =>
                  todoStore.editTodoText(item.id, e.target.value)}
                onBlur={() => handleOnBlur({ text: item.text })}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <div
                role="checkbox"
                tabIndex={0}
                aria-checked={item.checked}
                onClick={() => handleCheckTodo({ checked: !item.checked })}
                onKeyDown={(e) =>
                  handleCheckTodoKeyDown(e, { checked: !item.checked })} // prettier-ignore
                className={clsx(
                  'h-full flex-auto break-all flex items-center',
                  isHovered && 'max-w-[92%] break-all text-gray-900',
                  !isHovered && 'truncate',
                  item.checked && 'line-through text-stone-300',
                )}
              >
                <span className={clsx('min-w-[2px]', !isHovered && 'truncate')}>
                  {item.text}
                </span>
              </div>
            )}

            {item.checked ? (
              <button
                type="button"
                className={clsx(
                  'self-start mt-4 md:mt-[6px] mr-1',
                  !isHovered && 'hidden',
                )}
                onClick={() => handleDeleteTodo()}
              >
                <HiOutlineX />
              </button>
            ) : (
              <button
                type="button"
                className={clsx(
                  'self-start mt-4 md:mt-[6px] mr-1',
                  !isHovered && 'hidden',
                )}
                onClick={() => setIsEditing(true)}
              >
                <HiPencil />
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default TodoItem
