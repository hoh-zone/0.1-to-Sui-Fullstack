import { networkConfig, suiClient } from '@/lib/contracts/network-config'
import type { User } from '@/types'
import { Transaction } from '@mysten/sui/transactions'

export const queryUsers = async () => {
  const users: User[] = []

  const eventType = `${networkConfig.testnet.variables.packageID}::sui_resource_mange::ProfileCreated`
  const events = await suiClient.queryEvents({
    query: { MoveEventType: eventType },
  })

  events.data.map((event) => {
    const user = event.parsedJson as User
    users.push(user)
  })

  return users
}

export function createProfileTx(name: string, description: string) {
  const tx = new Transaction()

  tx.moveCall({
    package: networkConfig.testnet.variables.packageID,
    module: 'sui_resource_mange',
    function: 'create_profile',
    arguments: [
      tx.pure.string(name),
      tx.pure.string(description),
      tx.object(networkConfig.testnet.variables.state),
    ],
  })

  return tx
}
