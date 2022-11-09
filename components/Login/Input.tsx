import { Inputs } from '@/pages/login'
import { UseFormRegister } from 'react-hook-form'

interface Props {
  text: 'email' | 'password'
  register: UseFormRegister<Inputs>
}

const Input = ({ text, register }: Props) => {
  return (
    <div className="w-full border border-gray-200 rounded flex flex-col px-4 py-2">
      <label htmlFor={`${text}-input`} className="text-xs">
        {text}
      </label>
      <input
        id={`${text}-input`}
        type="text"
        className="focus:outline-none"
        {...register(text, { required: true })}
      />
    </div>
  )
}

export default Input
