import { createContext, useContext } from 'react'

/** True once the intro loader has finished — gates heavy canvas work. */
export const AppReadyContext = createContext(true)

export function useAppReady() {
  return useContext(AppReadyContext)
}
