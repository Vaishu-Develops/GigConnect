import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider } from './src/context/AuthContext'
import { ChatProvider } from './src/context/ChatContext'
import { GigProvider } from './src/context/GigContext'
import { NotificationProvider } from './src/context/NotificationContext'
import { ThemeProvider } from './src/context/ThemeContext'

// Components
import App from './src/App.js'

// Styles
import './src/styles/index.css'

// Create React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <GigProvider>
                <ChatProvider>
                  <App />
                  {/* Global Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#fff',
                        color: '#064e3b',
                        border: '1px solid #d1fae5',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(4, 120, 87, 0.15)',
                      },
                      success: {
                        iconTheme: {
                          primary: '#10b981',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        iconTheme: {
                          primary: '#dc2626',
                          secondary: '#fff',
                        },
                      },
                      loading: {
                        iconTheme: {
                          primary: '#f59e0b',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                </ChatProvider>
              </GigProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)