'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { ConnectButton } from '@mysten/dapp-kit'
import { Banana } from 'lucide-react'

export default function Header() {
  return (
    <div className='fixed top-0 z-10 w-full border-muted border-b bg-background/60 backdrop-blur-md'>
      <div className='mx-auto flex h-24 max-w-[1200px] items-center justify-between px-8'>
        <div className='flex items-center gap-4'>
          <Banana className='size-8' />
          <div className='flex flex-col'>
            <span className='font-bold text-xl'>S·R·M</span>
            <span className='font-semibold text-muted-foreground text-xs'>
              Sui Resource Manage
            </span>
          </div>
        </div>
        <div className='flex items-center justify-end gap-2'>
          <ModeToggle />
          <ConnectButton />
        </div>
      </div>
    </div>
  )
}
