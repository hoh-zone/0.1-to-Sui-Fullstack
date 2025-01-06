import { Alert } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { CircleAlert } from 'lucide-react'

export default function WalletStatus() {
  const account = useCurrentAccount()

  return (
    <Card className='w-full max-w-[450px]'>
      <CardHeader>
        <CardTitle>Wallet Status</CardTitle>
        <CardDescription>Your wallet information.</CardDescription>
      </CardHeader>
      <CardContent>
        {account ? (
          <div className='space-y-2 break-words text-sm'>
            <p className='font-semibold text-muted-foreground'>
              Wallet Address
            </p>
            <p className='font-bold'>{account?.address}</p>
          </div>
        ) : (
          <Alert variant='destructive'>
            <div className='flex items-center gap-2'>
              <CircleAlert className='size-4' />
              Your wallet not connected.
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
