import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { SubjectProvider } from './contexts/SubjectContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SubjectProvider>
        <App />
      </SubjectProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
