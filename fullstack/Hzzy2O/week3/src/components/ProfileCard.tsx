type Props = {
  name: string
}
export default function ProfileCard({name}: Props) {
  return (
    <div className='border-sm border-white'>
      <h2>name: {name}</h2>
    </div>
  );
}
