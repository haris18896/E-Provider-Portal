/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React from "react"

const StripeInput = ({ component: Component, inputRef, ...props }) => {
  const elementRef = useRef()
  useImperativeHandle(inputRef, () => ({
    focus: () => elementRef.current.focus
  }))
  return (
    <Component
      onReady={(element) => (elementRef.current = element)}
      {...props}
    />
  )
}

export default StripeInput
