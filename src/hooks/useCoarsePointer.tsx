import { useEffect, useState } from 'react'

/**
 * True on coarse-pointer devices (phones, most tablets). Used to gate expensive
 * canvas RAF loops and effects off on mobile, where they burn battery and jank.
 */
export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const onChange = () => setCoarse(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return coarse
}
