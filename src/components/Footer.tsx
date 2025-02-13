import { motion } from 'framer-motion'
import { FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa'

interface FooterProps {
  isSaygiBiz?: boolean
}

export default function Footer({ isSaygiBiz = false }: FooterProps) {
  const socialLinks = isSaygiBiz 
    ? [
      { icon: <FaInstagram size={24} />, url: 'https://www.instagram.com/saygibizofficial/', label: 'Instagram' },
      { icon: <FaTwitter size={24} />, url: 'https://x.com/saygibiz', label: 'Twitter' },
      { icon: <FaYoutube size={24} />, url: 'https://www.youtube.com/@babalaykativi', label: 'YouTube' },
      { icon: <FaTiktok size={24} />, url: 'https://www.tiktok.com/@saygibizofficial?lang=tr-TR', label: 'TikTok' }
    ]
    : [
      { icon: <FaInstagram size={24} />, url: 'https://www.instagram.com/saygibirofficial/', label: 'Instagram' },
      { icon: <FaTwitter size={24} />, url: 'https://x.com/saygibir', label: 'Twitter' },
      { icon: <FaYoutube size={24} />, url: 'https://www.youtube.com/@babalaykativi', label: 'YouTube' },
      { icon: <FaTiktok size={24} />, url: 'https://www.tiktok.com/@saygibir?lang=tr-TR', label: 'TikTok' }
    ]

  const email = isSaygiBiz ? 'saygibiz@sinerjimedya.com' : 'saygibir@sinerjimedya.com'

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
              SAYGI<span className="text-yellow-400">1</span>
            </motion.h3>
            <p className="text-white max-w-md">
              SAYGI1 - mor ve ötesi; birbirinden değerli sanatçılarla unutulmaz bir akşam için sizleri bekliyor.
            </p>
          </div>

          {/* İletişim */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white">İletişim</h4>
            <div className="space-y-2 text-white">
              <p>Email: {email}</p>
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
              target="_blank"
              rel="noopener noreferrer"
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