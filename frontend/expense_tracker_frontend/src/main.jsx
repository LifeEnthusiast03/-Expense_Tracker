import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ExpenseTracker from './expense_tracket.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseTracker/>
  </StrictMode>,
)
