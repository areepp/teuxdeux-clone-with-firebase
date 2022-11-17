import { getTodo } from '@/lib/todoService'
import TodoItem from './TodoItem'

const Todos = () => {
  const { todos } = getTodo()
  return (
    <div className="mt-12">
      {todos.map((todo) => (
        <TodoItem data={todo} key={todo.id} />
      ))}
    </div>
  )
}

export default Todos
