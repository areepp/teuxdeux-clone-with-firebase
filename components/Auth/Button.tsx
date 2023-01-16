import clsx from 'clsx'
import Spinner from './Spinner'

/* eslint-disable react/button-has-type */
const Button = ({
  text,
  type,
  disabled,
  className,
  onClick,
}: {
  text: string
  type: 'submit' | 'button'
  disabled: boolean
  className?: string
  onClick?: () => Promise<void>
}) => (
  <button
    className={clsx(
      'w-full text-lg py-4 bg-red-600 rounded text-gray-100 hover:bg-red-500 transition-all duration-300',
      className,
    )}
    type={type}
    disabled={disabled}
    onClick={onClick}
  >
    {disabled ? <Spinner /> : text}
  </button>
)

Button.defaultProps = {
  className: '',
  onClick: null,
}

export default Button
