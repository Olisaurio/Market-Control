import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { ProviderMarket } from './Context/Context'

createRoot(document.getElementById('root')).render(
  
    <ProviderMarket>
      <App />
    </ProviderMarket>
  
)
