import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import BackgroundAnimation from './BackgroundAnimation'

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isScrolled, setIsScrolled] = useState(false)

  const calculateTimeLeft = useCallback(() => {
    const targetDate = new Date('2025-06-01T00:00:00')
    const now = new Date()
    const difference = targetDate.getTime() - now.getTime()

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }, [])

  useEffect(() => {
    // Bir sonraki SAYGI1 tarihi: 2025 Haziran 1
    const targetDate = new Date('2025-06-01T00:00:00')

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      })
    }, 1000)

    // Scroll event listener ekle
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 100) // 100px scroll sonrası kaybolsun
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <BackgroundAnimation />
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

      {/* Animasyonlu Parçacıklar */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-0 left-0 w-full h-full 
                       bg-gradient-to-b from-black via-transparent to-black opacity-80" />
        <div className="particles absolute inset-0" /> {/* Parçacık animasyonu için */}
      </div>

      {/* Ana İçerik - z-index'i artırıldı */}
      <div className="relative z-20 text-center px-4 w-full max-w-4xl mx-auto">
        {/* Üst Kısım */}
        <div className="space-y-8 mb-20">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="gradient-text text-6xl md:text-8xl font-bold"
          >
            SAYGI1
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-purple-200"
          >
            Türkiye'nin En Büyük Konser Organizasyonu
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-purple-300/80"
          >
            "Müziğin Birleştirici Gücü"
          </motion.div>

          {/* Geri Sayım */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-6 text-center py-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
              <div className="text-4xl font-bold text-purple-400">{timeLeft.days}</div>
              <div className="text-purple-200/80 text-sm">GÜN</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
              <div className="text-4xl font-bold text-purple-400">{timeLeft.hours}</div>
              <div className="text-purple-200/80 text-sm">SAAT</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
              <div className="text-4xl font-bold text-purple-400">{timeLeft.minutes}</div>
              <div className="text-purple-200/80 text-sm">DAKİKA</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
              <div className="text-4xl font-bold text-purple-400">{timeLeft.seconds}</div>
              <div className="text-purple-200/80 text-sm">SANİYE</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl md:text-2xl font-light text-purple-300/60"
          >
            Bir Sonraki SAYGI1'e Kalan Süre
          </motion.div>
        </div>

        {/* Alt Kısım - Sabit Pozisyonlar */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 pb-8 z-20"
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
            <span className="bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 text-purple-200 text-sm md:text-base">
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
            <div className="text-purple-300/80 text-sm mb-4">
              Aşağı Kaydır
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-6 h-10 border-2 border-purple-400/50 rounded-full mx-auto 
                         flex justify-center items-start p-1"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-1.5 h-3 bg-purple-400 rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 