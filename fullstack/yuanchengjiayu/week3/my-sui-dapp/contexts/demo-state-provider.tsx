import { getState } from "../contracts/query"
import { useState, useCallback, useContext, createContext } from "react"


interface StateContextType {
    acount: number
    refresh:()=>Promise<void>
}

const StateContext = createContext<StateContextType | undefined>(undefined)

interface StateProviderProps {
    children: React.ReactNode
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
    const [acount, setAccount] = useState<number>(0)
    const refresh = useCallback(async () => {
        const state = await getState()
        const data = state.data?.content as unknown as {fields: {acount: number}}
        const acount = data.fields.acount
        setAccount(acount)
    }, [])

    return (
        <StateContext.Provider value={{ acount, refresh }}>{children}</StateContext.Provider>
    )
}

export function useStateContext() {
    const context = useContext(StateContext)
    if (!context) {
        throw new Error("useContext must be used within a StateProvider")
    }
    return context
}