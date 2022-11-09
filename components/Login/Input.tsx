const Input = ({ text }: { text: string }) => {
  return (
    <div className="w-full border border-gray-200 rounded flex flex-col px-4 py-2">
      <label htmlFor={`${text}-input`} className="text-xs">
        {text}
      </label>
      <input id={`${text}-input`} type="text" className="focus:outline-none" />
    </div>
  )
}

export default Input
