'use client'

import { useSuiClientQuery } from '@mysten/dapp-kit'

export default function OwnedObjects() {
  const { data, isPending } = useSuiClientQuery('getOwnedObjects', {
    owner: '0x937c8377e2506f9512633c3a45bc713db446f817bea566e1a9a8a0eced105064',
  })

  if (isPending) return <div>Loading...</div>

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
