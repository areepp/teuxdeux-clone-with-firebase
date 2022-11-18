import { getTodo } from '@/lib/todoService'
import TodoItem from './TodoItem'

const Todos = () => {
  const { todos } = getTodo()
  return (
    <div className="mt-12 h-full flex-grow bg-horizontal-lines">
      {todos.map((todo) => (
        <TodoItem data={todo} key={todo.id} />
      ))}
    </div>
  )
}

export default Todos
