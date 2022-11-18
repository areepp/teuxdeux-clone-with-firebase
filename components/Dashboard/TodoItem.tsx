export interface TodoItemProps {
  data: {
    todo: string
  }
}

const TodoItem = ({ data }: TodoItemProps) => {
  return <div className="py-3">{data.todo}</div>
}

export default TodoItem
