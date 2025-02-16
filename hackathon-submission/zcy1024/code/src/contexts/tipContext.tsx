'use client'

import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";

export const TipContext = createContext<[string, Dispatch<SetStateAction<string>>]>(["", () => {}])

export default function TipContextProvider({children}: {children: ReactNode}) {
    const [tips, setTips] = useState<string>("");
    return (
        <TipContext.Provider value={[tips, setTips]}>
            {children}
        </TipContext.Provider>
    )
}