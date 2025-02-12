import { motion } from 'framer-motion'
import { FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  const socialLinks = [
    { icon: <FaInstagram size={24} />, url: '#', label: 'Instagram' },
    { icon: <FaTwitter size={24} />, url: '#', label: 'Twitter' },
    { icon: <FaYoutube size={24} />, url: '#', label: 'YouTube' },
    { icon: <FaTiktok size={24} />, url: '#', label: 'TikTok' }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-black to-yellow-900/20 pt-20 pb-10">
      {/* Üst Kısım */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold gradient-text"
            >
              SAYGI1
            </motion.h3>
            <p className="text-yellow-200/70 max-w-md">
              Hayallerimize Hoş Geldiniz. 
              Eşsiz performanslar ve unutulmaz anlar için bizi takip edin.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-yellow-400">Hızlı Erişim</h4>
            <ul className="space-y-2">
              {['Ana Sayfa', 'Performanslar', 'Biletler', 'Hakkımızda', 'İletişim'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-yellow-200/60 hover:text-yellow-200 
                             transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-yellow-400">İletişim</h4>
            <div className="space-y-2 text-yellow-200/60">
              <p>Email: info@saygi1.com</p>
              <p>Tel: +90 (555) 123 45 67</p>
              <p>Adres: İstanbul, Türkiye</p>
            </div>
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="flex justify-center space-x-6 mb-12">
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.url}
              whileHover={{ scale: 1.1, y: -2 }}
              className="text-yellow-300/60 hover:text-yellow-300 
                         transition-colors duration-300"
              aria-label={social.label}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>

        {/* Alt Çizgi */}
        <div className="border-t border-yellow-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center 
                          text-sm text-yellow-200/40">
            <p>© 2024 SAYGI1. Tüm hakları saklıdır.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-yellow-200 transition-colors duration-300">
                Gizlilik Politikası
              </a>
              <a href="#" className="hover:text-yellow-200 transition-colors duration-300">
                Kullanım Şartları
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dekoratif Arka Plan */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 
                        bg-yellow-500/10 rounded-full filter blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 
                        bg-yellow-500/10 rounded-full filter blur-3xl" />
      </div>
    </footer>
  )
} 