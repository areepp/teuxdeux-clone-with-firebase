import { useAuth } from '@/components/AuthContext'
import useListStore, { IList } from '@/stores/lists'
import { useEffect, useRef, useState } from 'react'
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import Column from './Column'
import * as listService from '@/lib/list.service'
import LIST_DATA from '@/data/columns.json'
import { Droppable } from 'react-beautiful-dnd'

const ListView = () => {
  const [isListVisible, setIsListVisible] = useState(false)
  const listStore = useListStore()
  const { user } = useAuth()

  useEffect(() => {
    // async function syncColumnToFIrebase() {
    //   const listResponse = await listService.getLists(user!.uid)
    //   const listMapped = listResponse.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }))
    //   listStore.setLists(listMapped as IList[])
    // }
    // syncColumnToFIrebase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddList = async () => {
    // listStore.addList()
    // await listService.addList(user!.uid)
  }

  console.log(LIST_DATA)

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
                const list = LIST_DATA.columns.filter(
                  (column) => column.id === id,
                )[0]
                return <Column list={list} key={list.id} index={index} />
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
