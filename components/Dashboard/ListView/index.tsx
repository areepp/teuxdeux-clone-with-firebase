import { useAuth } from '@/components/AuthContext'
import useListStore, { IList } from '@/stores/lists'
import { useEffect, useState } from 'react'
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import ListColumn from './ListColumn'
import * as listService from '@/lib/list.service'
import { Droppable } from 'react-beautiful-dnd'
import useTodoStore, { ITodo } from '@/stores/todos'

const ListView = () => {
  const [isListVisible, setIsListVisible] = useState(false)
  const listStore = useListStore()
  const todoStore = useTodoStore()
  const { user } = useAuth()

  useEffect(() => {
    async function syncColumnToFirebase() {
      const [listResponse, listOrderResponse] = await Promise.all([
        listService.getLists(user!.uid),
        listService.getListOrder(user!.uid),
      ])
      const listMapped = listResponse.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      listStore.setLists(listMapped as IList[])
      listStore.setListOrder(listOrderResponse!.data()!.order)
    }
    syncColumnToFirebase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddList = async () => {
    const res = await listService.addList(user!.uid)
    await listService.addToListOrder(user!.uid, res.id)
    listStore.addList(res.id)
  }

  return (
    <div className="bg-zinc-50 px-5 py-2">
      <div className="flex items-center justify-between">
        <button
          className={`text-3xl ${
            isListVisible ? 'text-primary' : 'text-gray-400'
          }`}
          onClick={() => setIsListVisible(!isListVisible)}
        >
          {isListVisible ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
        </button>
        <div>re-order list</div>
        <button onClick={handleAddList} className="text-3xl text-gray-400">
          <IoIosAdd />
        </button>
      </div>
      {isListVisible && (
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="relative flex min-h-[500px]"
            >
              {listStore.listOrder.map((id, index) => {
                let listTodos

                const list = listStore.lists.filter((list) => list.id === id)[0]

                if (list.order.length === 0) {
                  listTodos = null
                } else {
                  listTodos = list.order.map(
                    (id) =>
                      todoStore.todos.find((todo) => todo.id === id) as ITodo,
                  )
                }

                return (
                  <ListColumn
                    list={list}
                    todos={listTodos}
                    key={list.id}
                    index={index}
                  />
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  )
}

export default ListView
