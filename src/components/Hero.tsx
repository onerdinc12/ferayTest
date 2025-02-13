import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll event listener ekle
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 100) // 100px scroll sonrası kaybolsun
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Arka Plan */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" /> {/* Overlay */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale"
          style={{ filter: 'brightness(0.6)' }}
        >
          <source src="/videos/concert-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Ana İçerik */}
      <div className="relative z-20 text-center px-4 w-full max-w-4xl mx-auto">
        {/* Üst Kısım */}
        <div className="space-y-8 mb-32 md:mb-20 pt-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-64 md:w-80 mx-auto"
          >
            <Image
              src="/images/logo.png"
              alt="SAYGI1 Logo"
              width={400}
              height={200}
              className="w-full h-auto"
              priority
            />
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white max-w-3xl mx-auto"
          >
            Saygı1 jüri üyeleri ve müzik direktörü tarafından yapılan değerlendirme sonucunda, finale kalan 10 isim belirlendi! Şimdi sıra sizde! Bu 10 isimden bir kişiyi seçerek, kazananı siz belirliyorsunuz. Kazanan isim, mor ve ötesi'nin sahnesinde unutulmaz bir performans sergileme şansına sahip olacak!
          </motion.p>
        </div>

        {/* Alt Kısım - Sabit Pozisyonlar */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 pb-12 md:pb-8 z-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: isScrolled ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Performans Seçimi Yönlendirmesi */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mb-12"
          >
            <span className="bg-black/70 backdrop-blur-sm rounded-full px-6 py-3 text-yellow-200 text-sm md:text-base
                           border border-yellow-500/20">
              ⭐ En İyi Performansı Seçmek İçin Aşağı Kaydır ⭐
            </span>
          </motion.div>

          {/* Aşağı Kaydırma Göstergesi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 1.2,
              repeat: Infinity,
              duration: 2,
              repeatType: "reverse"
            }}
          >
            <div className="text-yellow-300/80 text-sm mb-4">
              Aşağı Kaydır
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-6 h-10 border-2 border-yellow-400/50 rounded-full mx-auto 
                         flex justify-center items-start p-1"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-1.5 h-3 bg-yellow-400 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 