import { createRoot } from 'react-dom/client'
import { Main } from './main'
import './index.css'
import '@mysten/dapp-kit/dist/index.css'


const container = document.querySelector('#root') as HTMLElement
const root = createRoot(container)

root.render(<Main />)
