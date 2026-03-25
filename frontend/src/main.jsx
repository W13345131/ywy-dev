import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {/* 显示toast提示, 位置在右上角, 持续3秒 */}
      <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
      <App />
    </AuthProvider>
  </StrictMode>,
)
