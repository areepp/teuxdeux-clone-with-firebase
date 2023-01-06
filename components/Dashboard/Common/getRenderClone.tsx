import { ITodo } from '@/stores/todos'
import clsx from 'clsx'
import {
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'

/* eslint-disable react/display-name */
// prettier-ignore
export const getRenderClone = (todos: ITodo[] | null) =>
  (
    provided: DraggableProvided,
    _snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric,
  ) => {
    const item = todos?.filter(
      (todo: ITodo) => todo.id === rubric.draggableId,
    )[0]

    const { innerRef, draggableProps, dragHandleProps } = provided

    return (
      <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        className="z-50 h-[49px] md:text-sm md:h-[27px] flex items-center justify-between overflow-hidden bg-red-100 truncate"
      >
        <p className={clsx('truncate', item!.checked && 'line-through')}>
          {item!.text}
        </p>
      </div>
    )
  }
