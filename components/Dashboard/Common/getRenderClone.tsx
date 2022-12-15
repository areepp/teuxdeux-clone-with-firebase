import { ITodo } from '@/stores/todos'
import {
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'
import { HiPencil } from 'react-icons/hi'

/* eslint-disable react/display-name */
export const getRenderClone =
  (todos: ITodo[] | null) =>
  (
    provided: DraggableProvided,
    _snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric,
  ) => {
    const draggedTodoText = todos?.filter(
      (todo: ITodo) => todo.id === rubric.draggableId,
    )[0].text

    console.log(todos)
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
  }
