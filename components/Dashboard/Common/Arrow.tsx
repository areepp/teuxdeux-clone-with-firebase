import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'

interface Props {
  left?: boolean
  onClick: React.MouseEventHandler
  navigationDisabled?: boolean
}

const Arrow = ({ left, onClick, navigationDisabled }: Props) => (
  <button
    type="button"
    className={`${
      navigationDisabled ? 'text-gray-400' : 'text-primary'
    } text-primary text-4xl`}
    disabled={navigationDisabled}
    onClick={onClick}
  >
    {left ? <FaChevronLeft /> : <FaChevronRight />}
  </button>
)

Arrow.defaultProps = {
  left: false,
  navigationDisabled: false,
}

export default Arrow
