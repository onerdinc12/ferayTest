import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#27272a',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(8px)',
          },
          success: {
            iconTheme: {
              primary: '#a855f7',
              secondary: '#fff',
            },
          }
        }}
      />
    </>
  )
} 