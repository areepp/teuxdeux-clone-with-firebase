import { useState } from 'react'
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'

const ListView = () => {
  const [isListVisible, setIsListVisible] = useState(true)
  return (
    <div className="bg-zinc-50 px-5 py-2">
      <div className="flex items-center justify-between">
        <button
          className={`text-3xl ${
            isListVisible ? 'text-primary' : 'text-gray-400'
          }`}
          onClick={() => setIsListVisible(!isListVisible)}
        >
          {isListVisible ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
        </button>
        <div>re-order list</div>
        <button className="text-3xl text-gray-400">
          <IoIosAdd />
        </button>
      </div>
      {isListVisible && <div className="min-h-[500px]">something</div>}
    </div>
  )
}

export default ListView
