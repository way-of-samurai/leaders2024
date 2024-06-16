import { Button } from "@/components/ui/button"
import { forwardRef } from "react"
import { useFormStatus } from "react-dom"

const SubmitButton = forwardRef(({ disabled, children, ...props }, ref) => {
  const { pending } = useFormStatus()

  return (
    <Button
      ref={ref}
      type="submit"
      disabled={pending || disabled}
      {...props}
    >
      {children}
    </Button>
  )
})
SubmitButton.displayName = "SubmitButton"

export { SubmitButton }
