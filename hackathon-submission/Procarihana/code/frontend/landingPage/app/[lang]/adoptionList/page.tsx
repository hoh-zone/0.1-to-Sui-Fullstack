"use client"

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { useState } from 'react'
import { PetList } from "./components/PetList"

export default function AdoptionList() {
    const [queryClient] = useState(() => new QueryClient())
    return (<QueryClientProvider client={queryClient}>
        <div className="pl-10 pr-10 w-full flex flex-col items-center justify-center">
            <PetList></PetList>
        </div>
    </QueryClientProvider>)
}