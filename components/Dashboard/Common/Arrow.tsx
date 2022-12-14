import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'

interface Props {
  left?: boolean
  onClick: React.MouseEventHandler
  navigationDisabled?: boolean
}

const Arrow = ({ left, onClick, navigationDisabled }: Props) => {
  return (
    <button
      className={`${
        navigationDisabled ? 'text-gray-400' : 'text-primary'
      } text-primary text-4xl`}
      disabled={navigationDisabled}
      onClick={onClick}
    >
      {left ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
  )
}

export default Arrow
