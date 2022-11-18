import { getTodo } from '@/lib/todoService'

const Todos = () => {
  const { todos } = getTodo()
  return (
    <div className="mt-12 h-full flex-grow bg-horizontal-lines">
      {todos.map((item) => (
        <div className="h-[49px] flex items-center" key={item.id}>
          {item.todo}
        </div>
      ))}
      <input
        className="h-[49px] flex items-center w-full focus:outline-none bg-transparent"
        type="text"
      />
    </div>
  )
}

export default Todos
