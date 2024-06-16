"use client"

import { useEffect, useState } from "react"

export const useSize = (target) => {
  const [size, setSize] = useState()

  useEffect(() => {
    if (!target.current) return
    setSize(target.current.getBoundingClientRect())

    const resizeObserver = new ResizeObserver(() => {
      setSize(target.current.getBoundingClientRect())
    })
    resizeObserver.observe(target.current)
    return () => resizeObserver.disconnect() // clean up
  }, [target])
  return size
}
