import useListStore, { IList } from '@/stores/lists'
import { useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { IoReorderTwoOutline } from 'react-icons/io5'

interface Props {
  list: IList
  index: number
}

const Column = ({ list, index }: Props) => {
  const listStore = useListStore()
  const [newTodoInputValue, setNewTodoInputValue] = useState<string>('')

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
            <input
              className="h-[49px] text-gray-900 md:h-[27px] flex items-center w-full focus:outline-none bg-transparent"
              type="text"
              value={newTodoInputValue}
              onChange={(e) => setNewTodoInputValue(e.target.value)}
              // onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default Column
