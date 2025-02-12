import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { checkAdminSession, adminLogout } from '../../utils/adminAuth'
import { getStats } from '../../utils/adminStats'
import toast from 'react-hot-toast'

interface Stats {
  summary: {
    totalVotes: number
    todayVotes: number
    lastHourVotes: number
  }
  videoStats: Array<{
    video_id: string
    count: number
  }>
  platformStats: Array<{
    platform: string
    count: number
  }>
  trends: {
    hourly: Array<{
      hour: string
      count: number
    }>
    daily: Array<{
      day: string
      count: number
    }>
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const isAdmin = await checkAdminSession()
      if (!isAdmin) {
        router.push('/dashboard-feray-x8k2p9')
        return
      }
      setIsAuthorized(true)
      // İlk yüklemede istatistikleri al
      fetchStats()
    }
    checkAuth()
  }, [router])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const data = await getStats()
      setStats(data)
      toast.success('İstatistikler güncellendi')
    } catch (error) {
      console.error('İstatistik alma hatası:', error)
      toast.error('İstatistikler alınırken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await adminLogout()
      toast.success('Çıkış yapıldı')
      router.push('/dashboard-feray-x8k2p9')
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu')
      console.error('Çıkış hatası:', error)
    }
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <>
      <Head>
        <title>404 - Sayfa Bulunamadı</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-yellow-900/40 to-black text-yellow-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-400">Sinerji Medya Yönetim Paneli</h1>
            <div className="flex gap-4">
              <button
                onClick={fetchStats}
                disabled={isLoading}
                className={`px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black 
                         rounded-lg transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Yenileniyor...' : 'İstatistikleri Yenile'}
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black 
                         rounded-lg transition-colors duration-300"
              >
                Çıkış Yap
              </button>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-lg font-medium text-yellow-300 mb-2">Toplam Oy</h3>
              <p className="text-3xl font-bold">{stats?.summary.totalVotes || 0}</p>
            </div>
            <div className="bg-black/30 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-lg font-medium text-yellow-300 mb-2">Bugünkü Oy</h3>
              <p className="text-3xl font-bold">{stats?.summary.todayVotes || 0}</p>
            </div>
            <div className="bg-black/30 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-lg font-medium text-yellow-300 mb-2">Son 1 Saatteki Oy</h3>
              <p className="text-3xl font-bold">{stats?.summary.lastHourVotes || 0}</p>
            </div>
          </div>

          {/* Video Bazlı Oy Tablosu */}
          <div className="bg-black/30 border border-yellow-500/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Video Bazlı Oylar</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-yellow-500/20">
                    <th className="text-left py-3 px-4">Video ID</th>
                    <th className="text-center py-3 px-4">Toplam Oy</th>
                    <th className="text-center py-3 px-4">Oran</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.videoStats.map((video) => {
                    const ratio = ((video.count / (stats.summary.totalVotes || 1)) * 100).toFixed(1)
                    return (
                      <tr key={video.video_id} className="border-b border-yellow-500/10">
                        <td className="py-3 px-4">{video.video_id}</td>
                        <td className="text-center py-3 px-4">{video.count}</td>
                        <td className="text-center py-3 px-4">%{ratio}</td>
                      </tr>
                    )
                  }) || (
                    <tr className="border-b border-yellow-500/10">
                      <td colSpan={3} className="py-3 px-4 text-center">
                        {isLoading ? 'Yükleniyor...' : 'Veri bulunamadı'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform Dağılımı */}
          <div className="bg-black/30 border border-yellow-500/20 rounded-xl p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Platform Dağılımı</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-yellow-500/20">
                    <th className="text-left py-3 px-4">Platform</th>
                    <th className="text-center py-3 px-4">Oy Sayısı</th>
                    <th className="text-center py-3 px-4">Oran</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.platformStats.map((platform) => {
                    const ratio = ((platform.count / (stats.summary.totalVotes || 1)) * 100).toFixed(1)
                    return (
                      <tr key={platform.platform} className="border-b border-yellow-500/10">
                        <td className="py-3 px-4">{platform.platform}</td>
                        <td className="text-center py-3 px-4">{platform.count}</td>
                        <td className="text-center py-3 px-4">%{ratio}</td>
                      </tr>
                    )
                  }) || (
                    <tr className="border-b border-yellow-500/10">
                      <td colSpan={3} className="py-3 px-4 text-center">
                        {isLoading ? 'Yükleniyor...' : 'Veri bulunamadı'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}