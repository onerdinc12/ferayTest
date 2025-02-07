import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CacheManager } from '../utils/cache'
import { checkIfIpVoted, castVote, getVoteCount } from '../utils/supabase'
import toast from 'react-hot-toast'
import ReCAPTCHA from 'react-google-recaptcha'

interface Video {
  id: string
  title: string
  description: string
  votes: number
}

// Modal bileşeni
const ConfirmModal = ({ isOpen, onClose, onConfirm, videoTitle }: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  videoTitle: string
}) => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)

  const handleConfirm = () => {
    if (!captchaValue) {
      toast.error('Lütfen robot olmadığınızı doğrulayın.')
      return
    }
    onConfirm()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative bg-black/90 p-8 rounded-xl max-w-md w-full mx-4
                     border border-yellow-500/20 backdrop-blur-sm shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Oy Kullanım Onayı</h3>
            <p className="text-yellow-200 mb-6">
              "{videoTitle}" başlıklı videoya oyunuzu kullanmak üzeresiniz. 
              <span className="block mt-2 text-yellow-300 font-semibold">
                Kullandığınız oy geri alınamaz.
              </span>
            </p>

            <div className="flex justify-center mb-6">
              <ReCAPTCHA
                sitekey="6LfRXYEpAAAAAJH3fNwfJXxgCQxbDJsDHgvwzHXC"
                onChange={(value) => setCaptchaValue(value)}
                theme="dark"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full text-yellow-200 hover:text-yellow-100
                         transition-colors duration-300"
              >
                İptal
              </button>
              <button
                onClick={handleConfirm}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-semibold
                          ${!captchaValue 
                            ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                            : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black transform hover:scale-105'
                          }`}
                disabled={!captchaValue}
              >
                Evet, Oy Ver
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const VideoCard = memo(({ video, onVote, index, hasVotedAny }: {
  video: Video
  onVote: (videoId: string) => void
  index: number
  hasVotedAny: boolean
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleVoteClick = () => {
    if (!hasVotedAny) {
      setShowConfirm(true)
    }
  }

  const handleConfirmVote = () => {
    setShowConfirm(false)
    onVote(video.id)
  }

  return (
    <>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmVote}
        videoTitle={video.title}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-black/30 rounded-xl overflow-hidden card-hover-effect"
      >
        <div className="aspect-video relative">
          <iframe
            onLoad={() => setIsLoading(false)}
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-yellow-200 group-hover:text-white
                         transition-colors duration-300">
              {video.title}
            </h3>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: hasVotedAny ? 1 : 1.05 }}
              whileTap={{ scale: hasVotedAny ? 1 : 0.95 }}
              onClick={handleVoteClick}
              className={`px-6 py-3 rounded-full transition-all duration-300
                        text-black font-semibold text-sm shadow-lg
                        ${hasVotedAny 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700'
                        }`}
              disabled={hasVotedAny}
            >
              {hasVotedAny ? 'Oy Kullanıldı' : 'Oy Ver'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
})

VideoCard.displayName = 'VideoCard'

export default function VoteSection() {
  const initialVideos = [
    { 
      id: 'oDQ5tEkOicg',
      title: 'Hande Yener - Sopa',
      description: 'Pop Müziğin Kraliçesinden Muhteşem Performans',
      votes: 0 
    },
    { 
      id: 'sXXPgal-BM0',
      title: 'Sertab Erener - Olsun',
      description: 'Efsane Şarkının Yeni Yorumu',
      votes: 0 
    },
    { 
      id: 'WBCiQTk5knY',
      title: 'Sertab Erener - Bir Çaresi Bulunur',
      description: 'Unutulmaz Şarkının SAYGI1 Versiyonu',
      votes: 0 
    },
    { 
      id: 'NPUTdqYUa9A',
      title: 'EDİS - MARTILAR',
      description: 'EDİS\'in muhteşem performansı',
      votes: 0 
    }
  ]

  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [hasVoted, setHasVoted] = useState(false)
  const [userIp, setUserIp] = useState<string>('')
  const cache = CacheManager.getInstance()

  // IP adresini al
  useEffect(() => {
    const getIp = async () => {
      try {
        const res = await fetch('/api/getIp')
        const data = await res.json()
        setUserIp(data.ip)
        
        // IP ile oy kullanılmış mı kontrol et
        const hasVoted = await checkIfIpVoted(data.ip)
        setHasVoted(hasVoted)
      } catch (error) {
        console.error('IP alma hatası:', error)
      }
    }

    getIp()
  }, [])

  // Oy sayılarını periyodik olarak güncelle
  useEffect(() => {
    const updateVoteCounts = async () => {
      const updatedVideos = await Promise.all(
        videos.map(async (video) => ({
          ...video,
          votes: await getVoteCount(video.id)
        }))
      )
      setVideos(updatedVideos)
    }

    updateVoteCounts()
    const interval = setInterval(updateVoteCounts, 30000) // Her 30 saniyede bir güncelle

    return () => clearInterval(interval)
  }, [])

  const handleVote = useCallback(async (videoId: string) => {
    if (hasVoted || !userIp) return

    try {
      await castVote(videoId, userIp)
      setHasVoted(true)
      
      // Oy sayılarını güncelle
      const updatedVideos = await Promise.all(
        videos.map(async (video) => ({
          ...video,
          votes: await getVoteCount(video.id)
        }))
      )
      setVideos(updatedVideos)

      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Oyunuz Kaydedildi!</span>
          <span className="text-sm opacity-90">
            Teşekkür ederiz, oyunuz başarıyla sayıldı.
          </span>
        </div>,
        {
          icon: '🎉',
          className: 'bg-zinc-900/90 backdrop-blur-sm border border-yellow-500/20',
        }
      )
    } catch (error) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Hata!</span>
          <span className="text-sm opacity-90">
            {error instanceof Error ? error.message : 'Oy kullanılırken bir hata oluştu.'}
          </span>
        </div>,
        {
          icon: '❌',
          className: 'bg-zinc-900/90 backdrop-blur-sm border border-red-500/20',
        }
      )
    }
  }, [hasVoted, userIp, videos])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black via-yellow-900/20 to-black">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold text-center mb-20 gradient-text"
      >
        En İyi Performansı Seç
      </motion.h2>
      
      {hasVoted && (
        <div className="text-center mb-10 text-yellow-300">
          Oy hakkınızı kullandınız. Teşekkür ederiz!
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onVote={handleVote}
              index={index}
              hasVotedAny={hasVoted}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 