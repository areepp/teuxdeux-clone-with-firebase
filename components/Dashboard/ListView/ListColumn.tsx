import { useAuth } from '@/components/AuthContext'
import useListStore, { IList } from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import { useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { IoReorderTwoOutline } from 'react-icons/io5'
import TodoItem from './TodoItem'
import * as todoService from '@/lib/todo.service'
import * as listService from '@/lib/list.service'

interface Props {
  list: IList
  index: number
  todos: ITodo[] | null
}

const ListColumn = ({ todos, list, index }: Props) => {
  const { user } = useAuth()
  const listStore = useListStore()
  const todoStore = useTodoStore()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')

  const handleAddTodo = async () => {
    const res = await todoService.addTodo(user!.uid, {
      text: newTodoInputValue,
      checked: false,
    })
    setNewTodoInputValue('')
    listStore.pushToListOrder(list.id, res.id)
    todoStore.pushTodo({ id: res.id, text: newTodoInputValue, checked: false })
    await listService.addToListOrder(user!.uid, list.id, res.id)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleAddTodo()
    }
  }

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="px-4 text-gray-900 flex-grow"
        >
          <div
            {...provided.dragHandleProps}
            className="mt-20 w-full flex justify-center text-2xl"
          >
            <IoReorderTwoOutline />
          </div>
          <input
            autoFocus
            type="text"
            value={list.title}
            onChange={(e) => listStore.setListTitle(list.id, e.target.value)}
            className=" w-full mx-auto bg-inherit font-gothic text-center uppercase text-6xl md:text-4xl focus:outline-none hover:bg-stone-300 transition-all"
          />
          <div className="h-full mt-10 md:mt-4 md:text-sm bg-mobile-horizontal-lines md:bg-md-horizontal-lines">
            <Droppable droppableId={`list-${list.id}`} type="todo">
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
      )}
    </Draggable>
  )
}

export default ListColumn
