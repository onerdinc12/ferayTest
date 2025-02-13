import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FaArrowRight, FaChevronDown } from 'react-icons/fa'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isSertabParticipantsOpen, setIsSertabParticipantsOpen] = useState(false)
  const [isCezaParticipantsOpen, setIsCezaParticipantsOpen] = useState(false)
  const [isSertabHostsOpen, setIsSertabHostsOpen] = useState(false)
  const [isCezaHostsOpen, setIsCezaHostsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Geri sayım için useEffect
  useEffect(() => {
    const targetDate = new Date('2025-02-27T21:00:00')

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

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Afiş Arka Plan */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <div className="relative w-full h-full">
            {/* Mobil için afiş */}
            <div className="block md:hidden w-full h-full">
              <Image
                src="/images/Saygi1_Mobile.png"
                alt="SAYGI1 Mor ve Ötesi Afiş"
                fill
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: 'center center' }}
                priority
                quality={100}
                unoptimized={true}
              />
            </div>
            
            {/* Desktop için afiş */}
            <div className="hidden md:block w-full h-full">
              <Image
                src="/images/Saygı1_MVO_1200x630.png"
                alt="SAYGI1 Mor ve Ötesi Afiş"
                fill
                sizes="100vw"
                className="object-contain"
                style={{ objectPosition: 'center center' }}
                priority
                quality={100}
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hakkında Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="flex flex-col items-center justify-center space-y-8 mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="w-64 md:w-96 mx-auto"
            >
              <Image
                src="/images/logo2.png"
                alt="SAYGI1 Logo 2"
                width={400}
                height={200}
                className="w-full h-auto"
                priority
              />
            </motion.div>

            <motion.div className="flex flex-col items-center justify-center space-y-2">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl text-center text-white font-bold"
              >
                27 Şubat Perşembe
              </motion.p>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-center text-white/80"
              >
                Ülker Etkinlik ve Spor Salonu'nda
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mb-16"
          >
            <a
              href="https://iticket.com.tr/events/music/saygi1-mor-ve-otesi-konseri-bilet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r 
                       from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 
                       text-black font-bold rounded-full transition-all duration-300 
                       transform hover:scale-105 text-lg shadow-xl"
            >
              Bilet Al <FaArrowRight />
            </a>
          </motion.div>

          {/* Video Section Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
          >
            SAYGI1 Performansları
          </motion.h2>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sertab Erener Bölümü */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold text-center text-white mb-8"
              >
                SAYGI1 - Sertab Erener
              </motion.h3>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/kvSaawzWcVU?si=AvQmYuD5nqTpsmqf"
                    title="Sertab Erener SAYGI1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                
                {/* Sertab Katılımcı Listesi */}
                <div className="space-y-4">
                  {/* Sanatçılar Akordiyon */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                    <button
                      onClick={() => setIsSertabParticipantsOpen(!isSertabParticipantsOpen)}
                      className="w-full flex items-center justify-between text-xl font-bold text-white mb-4"
                    >
                      <span>SAYGI1 - Sertab Erener Sanatçılar</span>
                      <FaChevronDown
                        className={`transform transition-transform duration-300 ${
                          isSertabParticipantsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {isSertabParticipantsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="space-y-1 text-white">
                          <li>Aleyna Tilki</li>
                          <li>Can Ozan</li>
                          <li>Ceylan Ertem</li>
                          <li>Doğukan Manço</li>
                          <li>Emir Can İğrek</li>
                          <li>Gökhan Türkmen</li>
                          <li>Kalben</li>
                          <li>Karsu</li>
                          <li>Kenan Doğulu</li>
                          <li>Levent Yüksel</li>
                          <li>Melek Mosso</li>
                          <li>Mirkelam</li>
                          <li>Nil Karaibrahimgil & Serdar Erener</li>
                          <li>Nova Norda</li>
                          <li>Oğuzhan Uğur</li>
                          <li>Paptircem</li>
                          <li>Şanışer</li>
                          <li>Şara Kaplan</li>
                          <li>Selin Geçit</li>
                          <li>Soner Sarıkabadayı</li>
                          <li>TNK</li>
                        </ul>
                      </motion.div>
                    )}
                  </div>

                  {/* Sunucular Akordiyon */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                    <button
                      onClick={() => setIsSertabHostsOpen(!isSertabHostsOpen)}
                      className="w-full flex items-center justify-between text-xl font-bold text-white mb-4"
                    >
                      <span>SAYGI1 - Sertab Erener Sunucular</span>
                      <FaChevronDown
                        className={`transform transition-transform duration-300 ${
                          isSertabHostsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {isSertabHostsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="space-y-1 text-white">
                          <li>Arda Türkmen</li>
                          <li>Bilal Yıldız</li>
                          <li>Cem Gelinoğlu</li>
                          <li>Danla Bilic</li>
                          <li>Didem Soydan</li>
                          <li>Emre Yücelen</li>
                          <li>Enis Arıkan</li>
                          <li>Gökçe</li>
                          <li>Gökhan Çınar</li>
                          <li>Gülşah Saraçoğlu</li>
                          <li>Hayrettin</li>
                          <li>Hikayeden Adamlar</li>
                          <li>Mehmet Yalçınkaya</li>
                          <li>Sarp Bozkurt</li>
                          <li>Somer Sivrioğlu</li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Ceza Bölümü */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold text-center text-white mb-8"
              >
                SAYGI1 - Ceza
              </motion.h3>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Zpgof8hgszg?si=FupWFEZeIjaGSYv4"
                    title="Ceza SAYGI1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {/* Ceza Katılımcı Listesi */}
                <div className="space-y-4">
                  {/* Sanatçılar Akordiyon */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                    <button
                      onClick={() => setIsCezaParticipantsOpen(!isCezaParticipantsOpen)}
                      className="w-full flex items-center justify-between text-xl font-bold text-white mb-4"
                    >
                      <span>SAYGI1 - Ceza Sanatçılar</span>
                      <FaChevronDown
                        className={`transform transition-transform duration-300 ${
                          isCezaParticipantsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {isCezaParticipantsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="space-y-1 text-white">
                          <li>Anıl Piyancı</li>
                          <li>Ayben</li>
                          <li>Baneva</li>
                          <li>Candan Erçetin</li>
                          <li>Cartel/Erci E</li>
                          <li>Cakal</li>
                          <li>Gazapizm</li>
                          <li>Gripin</li>
                          <li>Killa Hakan</li>
                          <li>Lil Begy</li>
                          <li>M Lisa</li>
                          <li>Manga</li>
                          <li>Oğuzhan Uğur</li>
                          <li>Ozbi</li>
                          <li>Sefo</li>
                          <li>Server Uraz</li>
                          <li>Şehinşah</li>
                          <li>Yener Çevik</li>
                        </ul>
                      </motion.div>
                    )}
                  </div>

                  {/* Sunucular Akordiyon */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                    <button
                      onClick={() => setIsCezaHostsOpen(!isCezaHostsOpen)}
                      className="w-full flex items-center justify-between text-xl font-bold text-white mb-4"
                    >
                      <span>SAYGI1 - Ceza Sunucular</span>
                      <FaChevronDown
                        className={`transform transition-transform duration-300 ${
                          isCezaHostsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {isCezaHostsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className="space-y-1 text-white">
                          <li>Ali Biçim</li>
                          <li>Arem & Arman</li>
                          <li>Berk Keklik</li>
                          <li>Beyazıt Öztürk</li>
                          <li>Bilal Yıldız</li>
                          <li>Burcu Erenkul</li>
                          <li>Doğu Demirkol</li>
                          <li>Doğukan Manço</li>
                          <li>Emre Karayel</li>
                          <li>Eser Yenenler</li>
                          <li>Haruncan</li>
                          <li>İlker Ayrık</li>
                          <li>Mesutcan Tomay</li>
                          <li>Nurgül Yeşilçay</li>
                          <li>Ogün Sanlısoy</li>
                          <li>Özlem Gürses</li>
                          <li>Pınar Sabancı</li>
                          <li>Timur Acar</li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SaygıBiz CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-yellow-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-8"
          >
            SaygıBiz'e Oy Kullan
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white mb-12"
          >
            Finale kalan 10 yetenekten birini seçerek, mor ve ötesi sahnesinde
            performans sergileme şansı kazanmasına yardımcı ol!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/saygibiz"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r 
                       from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 
                       text-black font-bold rounded-full transition-all duration-300 
                       transform hover:scale-105 text-lg"
            >
              Hemen Oy Ver <FaArrowRight />
            </Link>
          </motion.div>

          {/* Geri Sayım Bölümü */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8 px-4 mt-32"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">SAYGI1'e Kalan Zaman</h3>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 px-4">
            <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4 md:p-6 w-[140px] md:min-w-[120px]
                        transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-5xl font-bold text-white mb-2">{timeLeft.days}</div>
              <div className="text-white text-xs md:text-sm uppercase tracking-wider">Gün</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4 md:p-6 w-[140px] md:min-w-[120px]
                        transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-5xl font-bold text-white mb-2">{timeLeft.hours}</div>
              <div className="text-white text-xs md:text-sm uppercase tracking-wider">Saat</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4 md:p-6 w-[140px] md:min-w-[120px]
                        transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-5xl font-bold text-white mb-2">{timeLeft.minutes}</div>
              <div className="text-white text-xs md:text-sm uppercase tracking-wider">Dakika</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4 md:p-6 w-[140px] md:min-w-[120px]
                        transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl md:text-5xl font-bold text-white mb-2">{timeLeft.seconds}</div>
              <div className="text-white text-xs md:text-sm uppercase tracking-wider">Saniye</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 