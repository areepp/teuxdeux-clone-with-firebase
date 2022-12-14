import { useAuth } from '@/components/AuthContext'
import useListStore, { IList } from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { TbDotsVertical } from 'react-icons/tb'
import TodoItem from './TodoItem'
import * as todoService from '@/lib/todo.service'
import * as listService from '@/lib/list.service'
import { HiPencil } from 'react-icons/hi'
import ListOption from './ListOption'

interface Props {
  list: IList
  todos: ITodo[] | null
}

const ListColumn = ({ todos, list }: Props) => {
  const { user } = useAuth()
  const listStore = useListStore()
  const todoStore = useTodoStore()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')
  const [isOptionVisible, setIsOptionVisible] = useState(false)

  const handleAddTodo = async () => {
    const res = await todoService.addTodo(user!.uid, {
      text: newTodoInputValue,
      checked: false,
    })
    setNewTodoInputValue('')
    listStore.pushToListOrder(list.id, res.id)
    todoStore.pushTodo({ id: res.id, text: newTodoInputValue, checked: false })
    await listService.addTodoToListOrder(user!.uid, list.id, res.id)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleAddTodo()
    }
  }

  const openListOption = () => {
    setIsOptionVisible(!isOptionVisible)
  }

  return (
    <div className="relative h-full px-4 w-full text-gray-900 flex-grow drag-fix">
      <div className="relative left-40 md:left-0">
        <button
          onClick={openListOption}
          className="mt-20 flex justify-start py-1 rounded text-xl hover:bg-zinc-300 transition-all"
        >
          <TbDotsVertical />
        </button>
        {isOptionVisible && <ListOption listId={list.id} />}
      </div>
      <input
        type="text"
        value={list.title}
        onChange={(e) => listStore.setListTitle(list.id, e.target.value)}
        onBlur={async () =>
          await listService.editListTitle(user!.uid, list.id, {
            title: list.title,
          })
        }
        className="flex items-center mx-auto bg-inherit font-gothic text-center uppercase text-6xl md:text-4xl focus:outline-none hover:bg-stone-300 transition-all"
      />
      <div className="h-full mt-10 md:mt-4 md:text-sm bg-mobile-horizontal-lines md:bg-md-horizontal-lines">
        <Droppable
          droppableId={`list-${list.id}`}
          type="todo"
          renderClone={(provided, _snapshot, rubric) => {
            // renderClone allows to move todo item to other parent (CALENDAR VIEW) whilte maintaining the correct styles
            const draggedTodoText = todos!.filter(
              (todo) => todo.id === rubric.draggableId,
            )[0].text

            return (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`z-50 h-[49px] md:text-sm md:h-[27px] flex items-center justify-between`}
              >
                <p className="">{draggedTodoText}</p>
                <div>
                  <HiPencil />
                </div>
              </div>
            )
          }}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {todos &&
                todos.map((item, i) => {
                  if (!item) return
                  return (
                    <TodoItem
                      item={item}
                      index={i}
                      key={item.id}
                      listId={list.id}
                    />
                  )
                })}
              {provided.placeholder}
              <input
                className="h-[49px] text-gray-900 md:h-[27px] flex items-center w-full focus:outline-none bg-transparent"
                type="text"
                value={newTodoInputValue}
                onChange={(e) => setNewTodoInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default ListColumn
