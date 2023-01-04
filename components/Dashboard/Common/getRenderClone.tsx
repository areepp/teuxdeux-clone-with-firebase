import { ITodo } from '@/stores/todos'
import clsx from 'clsx'
import {
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'

/* eslint-disable react/display-name */
export const getRenderClone =
  (todos: ITodo[] | null) =>
  (
    provided: DraggableProvided,
    _snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric,
  ) => {
    const item = todos?.filter(
      (todo: ITodo) => todo.id === rubric.draggableId,
    )[0]

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`z-50 h-[49px] md:text-sm md:h-[27px] flex items-center justify-between overflow-hidden bg-red-100 truncate`}
      >
        <p className={clsx('truncate', item!.checked && 'line-through')}>
          {item!.text}
        </p>
      </div>
    )
  }
