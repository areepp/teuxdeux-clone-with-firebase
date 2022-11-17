export interface TodoItemProps {
  data: {
    todo: string
  }
}

const TodoItem = ({ data }: TodoItemProps) => {
  return <div className="py-3 border-b border-gray-200">{data.todo}</div>
}

export default TodoItem
