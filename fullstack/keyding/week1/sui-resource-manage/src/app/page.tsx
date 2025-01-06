import CreateProfile from '@/components/create-profile'

export default function Home() {
  return (
    <div className='h-screen w-full bg-background py-24'>
      <div className='mx-auto flex h-full max-w-[1200px] items-center justify-center p-8'>
        <CreateProfile />
      </div>
    </div>
  )
}
