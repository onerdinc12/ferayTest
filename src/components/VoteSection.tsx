import { useState, useEffect, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { CacheManager } from '../utils/cache'
import toast from 'react-hot-toast'

interface Video {
  id: string
  title: string
  votes: number
}

const performanceData = [
  { 
    id: 'oDQ5tEkOicg',
    title: 'Hande Yener - Sopa',
    subtitle: 'SAYGI1 Özel Performans',
    description: 'Pop Müziğin Kraliçesinden Muhteşem Performans',
    votes: 0 
  },
  { 
    id: 'sXXPgal-BM0',
    title: 'Sertab Erener - Olsun',
    subtitle: 'SAYGI1 Canlı Performans',
    description: 'Efsane Şarkının Yeni Yorumu',
    votes: 0 
  },
  { 
    id: 'WBCiQTk5knY',
    title: 'Sertab Erener - Bir Çaresi Bulunur',
    subtitle: 'SAYGI1 Özel Sunum',
    description: 'Unutulmaz Şarkının SAYGI1 Versiyonu',
    votes: 0 
  }
]

// Video kartı bileşenini ayrı component olarak çıkaralım
const VideoCard = memo(({ video, onVote, index, hasVotedAny }: {
  video: Video
  onVote: (videoId: string) => void
  index: number
  hasVotedAny: boolean
}) => {
  return (
    <motion.div
      key={`${video.id}-${index}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      {/* Performans Numarası */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                     bg-purple-600 text-white w-16 h-16 rounded-full
                     flex items-center justify-center text-2xl font-bold
                     shadow-lg shadow-purple-500/50 z-10">
        #{index + 1}
      </div>

      {/* Video Kartı */}
      <div className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm
                     border border-purple-500/20 group-hover:border-purple-500/40
                     transition-all duration-300 shadow-xl
                     transform group-hover:scale-[1.02]">
        {/* Video Thumbnail */}
        <div className="aspect-video relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0"
          />
        </div>
        
        {/* Video Bilgileri */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-purple-200 group-hover:text-white
                         transition-colors duration-300">
              {video.title}
            </h3>
            <p className="text-purple-300/60 text-sm">
              SAYGI1 Özel Performans
            </p>
          </div>

          {/* Oy Bilgisi ve Buton */}
          <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 
                             bg-clip-text text-transparent">
                {video.votes}
              </span>
              <div className="flex flex-col">
                <span className="text-purple-300/80 text-sm">oy</span>
                <span className="text-purple-400/60 text-xs">toplam</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: hasVotedAny ? 1 : 1.05 }}
              whileTap={{ scale: hasVotedAny ? 1 : 0.95 }}
              onClick={() => !hasVotedAny && onVote(video.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300
                        text-white font-semibold text-sm shadow-lg
                        ${hasVotedAny 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                        }`}
              disabled={hasVotedAny}
            >
              {hasVotedAny ? 'Oy Hakkınız Kullanıldı' : 'Oy Ver'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

VideoCard.displayName = 'VideoCard'

export default function VoteSection() {
  // Başlangıç verilerini tanımlayalım
  const initialVideos = [
    { id: 'oDQ5tEkOicg', title: 'Hande Yener - Sopa', votes: 0 },
    { id: 'sXXPgal-BM0', title: 'Sertab Erener - Olsun', votes: 0 },
    { id: 'WBCiQTk5knY', title: 'Sertab Erener - Bir Çaresi Bulunur', votes: 0 }
  ]

  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [hasVoted, setHasVoted] = useState(false)
  const cache = CacheManager.getInstance()

  useEffect(() => {
    // Oy durumunu kontrol et
    const votingStatus = localStorage.getItem('hasVoted')
    if (votingStatus) {
      setHasVoted(JSON.parse(votingStatus))
    }

    // Kayıtlı oyları yükle
    const savedVotes = localStorage.getItem('videoVotes')
    if (savedVotes) {
      setVideos(JSON.parse(savedVotes))
    }
  }, [])

  const handleVote = useCallback((videoId: string) => {
    if (hasVoted) return

    setVideos(prevVideos => {
      const updatedVideos = prevVideos.map(video =>
        video.id === videoId 
          ? { ...video, votes: video.votes + 1 }
          : video
      )
      localStorage.setItem('videoVotes', JSON.stringify(updatedVideos))
      cache.set('votes', updatedVideos)
      return updatedVideos
    })

    setHasVoted(true)
    localStorage.setItem('hasVoted', 'true')

    // Modern bildirim
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Oyunuz Kaydedildi!</span>
        <span className="text-sm opacity-90">
          Teşekkür ederiz, oyunuz başarıyla sayıldı.
        </span>
      </div>,
      {
        icon: '🎉',
        className: 'bg-zinc-900/90 backdrop-blur-sm border border-purple-500/20',
      }
    )
  }, [hasVoted])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black via-purple-900/20 to-black">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold text-center mb-20 gradient-text"
      >
        En İyi Performansı Seç
      </motion.h2>
      
      {hasVoted && (
        <div className="text-center mb-10 text-purple-300">
          Oy hakkınızı kullandınız. Teşekkür ederiz!
        </div>
      )}
      
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        {[1, 2, 3, 4].map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(rowIndex < 3 ? videos : videos.slice(0, 1)).map((video, index) => (
              <VideoCard
                key={`${video.id}-${rowIndex}-${index}`}
                video={video}
                onVote={handleVote}
                index={index}
                hasVotedAny={hasVoted}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
} 