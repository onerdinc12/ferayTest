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
    <footer className="relative bg-black pt-20 pb-10">
      {/* Üst Kısım */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold text-white"
            >
              SAYGI1
            </motion.h3>
            <p className="text-white max-w-md">
              Hayallerimize Hoş Geldiniz. 
              Eşsiz performanslar ve unutulmaz anlar için bizi takip edin.
            </p>
          </div>

          {/* İletişim */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">İletişim</h4>
            <div className="space-y-2 text-white">
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
                          text-sm text-white">
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
    </footer>
  )
} 