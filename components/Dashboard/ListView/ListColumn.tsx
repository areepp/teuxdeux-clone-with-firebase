import { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/components/AuthContext'
import * as listService from '@/lib/list.service'
import * as todoService from '@/lib/todo.service'
import useListStore, { IList } from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import TodoItem from '../Common/TodoItem'
import { getRenderClone } from '../Common/getRenderClone'
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
  const renderClone = getRenderClone(todos)
  // renderClone allows to move todo item to other parent
  // (CALENDAR VIEW) while maintaining the desired drag behavior

  const handleAddTodo = async () => {
    setNewTodoInputValue('')
    const newTodoId = uuidv4()
    listStore.pushToListOrder(list.id, newTodoId)
    todoStore.pushTodo({
      id: newTodoId,
      text: newTodoInputValue,
      checked: false,
    })
    Promise.all([
      todoService.addTodo(user!.uid, newTodoId, {
        text: newTodoInputValue,
        checked: false,
      }),
      listService.addTodoToList(user!.uid, list.id, newTodoId),
    ])
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await handleAddTodo()
    }
  }

  const handleInputBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      return
    }
    await handleAddTodo()
  }

  return (
    <div className="relative h-full px-4 w-full text-gray-900 flex-grow drag-fix">
      {/* OPTION */}

      <ListOption listId={list.id} />

      {/* TITLE */}
      <input
        type="text"
        value={list.title}
        onChange={(e) => listStore.setListTitle(list.id, e.target.value)}
        onBlur={async () =>
          listService.editListTitle(user!.uid, list.id, {
            title: list.title,
          })} // prettier-ignore
        className="flex items-center mx-auto bg-inherit font-gothic text-center uppercase text-6xl md:text-4xl focus:outline-none hover:bg-stone-300 transition-all w-full"
      />

      {/* TODOS */}
      <div className="h-full mt-10 md:mt-4 md:text-sm bg-mobile-horizontal-lines md:bg-md-horizontal-lines">
        <Droppable
          droppableId={`list-${list.id}`}
          type="todo"
          renderClone={renderClone}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {todos &&
                todos.map((item, i) => {
                  if (!item) return undefined
                  return (
                    <TodoItem
                      item={item}
                      index={i}
                      key={item.id}
                      colId={list.id}
                      childOf="list"
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
                onBlur={handleInputBlur}
              />
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default ListColumn
