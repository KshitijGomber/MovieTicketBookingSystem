import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { CustomThemeProvider } from './context/ThemeContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <CustomThemeProvider>
            <App />
          </CustomThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
