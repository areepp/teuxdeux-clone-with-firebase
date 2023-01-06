import { UseFormRegister } from 'react-hook-form'

export interface Inputs {
  email: string
  password: string
}

interface Props {
  text: 'email' | 'password'
  register: UseFormRegister<Inputs>
  [rest: string]: any
}

const Input = ({ text, register, ...rest }: Props) => (
  <div className="w-full border border-gray-200 rounded flex flex-col px-4 py-2">
    <label htmlFor={`${text}-input`} className="text-xs">
      {text}
    </label>
    <input
      id={`${text}-input`}
      type="text"
      className="focus:outline-none"
      aria-label={`${text} input`}
      {...register(text, { required: true })}
      {...rest}
    />
  </div>
)

export default Input
