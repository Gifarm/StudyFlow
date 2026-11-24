"use client"

import * as React from "react"

import { Button, type ButtonProps } from "@/components/ui/button"

interface ConfirmButtonProps extends ButtonProps {
  message: string
}

/**
 * Tombol submit yang meminta konfirmasi sebelum menjalankan aksi destruktif.
 * Dipakai di dalam <form action={serverAction}>.
 */
const ConfirmButton = React.forwardRef<HTMLButtonElement, ConfirmButtonProps>(
  ({ message, onClick, ...props }, ref) => {
    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      if (!window.confirm(message)) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    return (
      <Button ref={ref} type="submit" onClick={handleClick} {...props} />
    )
  },
)
ConfirmButton.displayName = "ConfirmButton"

export { ConfirmButton }
