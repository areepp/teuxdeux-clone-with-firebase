import { useState } from 'react'
import Column from './Column'

const Todos = () => {
  // eslint-disable-next-line no-unused-vars
  const [columns, setColumns] = useState(['yesterday', 'today', 'tomorrow'])

  return (
    <div className="md:grid md:grid-cols-3 md:gap-4">
      {columns.map((col) => (
        <Column colId={col} key={col} />
      ))}
    </div>
  )
}

export default Todos
