import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'

interface Props {
  left?: boolean
  onClick: React.MouseEventHandler
}

const Arrow = ({ left, onClick }: Props) => {
  return (
    <button className="text-red-600 text-4xl" onClick={onClick}>
      {left ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
  )
}

export default Arrow
