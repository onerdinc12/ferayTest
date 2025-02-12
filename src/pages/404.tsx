import { motion } from 'framer-motion'
import Link from 'next/link'
import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Sayfa Bulunamadı | SAYGI1</title>
      </Head>

      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-8xl font-bold gradient-text">404</h1>
            <h2 className="text-2xl text-yellow-200">Sayfa Bulunamadı</h2>
            <p className="text-yellow-200/60 max-w-md mx-auto">
              Aradığınız sayfa bulunamadı veya taşınmış olabilir.
            </p>
            
            <div className="mt-8">
              <Link 
                href="/"
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 
                         text-black font-semibold rounded-full hover:from-yellow-500 
                         hover:to-yellow-700 transition-all duration-300 inline-block"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
} 