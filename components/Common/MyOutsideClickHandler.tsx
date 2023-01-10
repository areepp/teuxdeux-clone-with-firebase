import React, { useRef, useEffect } from 'react'

const useOutsideAlerter = (
  ref: React.RefObject<HTMLDivElement>,
  onOutsideClick: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onOutsideClick])
}

const MyOutsideClickHandler = ({
  onOutsideClick,
  children,
}: {
  onOutsideClick: () => void
  children: React.ReactNode
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useOutsideAlerter(wrapperRef, onOutsideClick)

  return <div ref={wrapperRef}>{children}</div>
}

export default MyOutsideClickHandler
