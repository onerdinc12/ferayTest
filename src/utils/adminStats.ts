import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL ve Service Role Key gerekli')
}

// Service role key ile admin client'ı oluştur
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

// Tüm istatistikleri tek seferde getir
export async function getStats() {
  try {
    // Tüm sorguları supabaseAdmin client'ı ile yap
    const { data: totalVotesData, error: totalError } = await supabaseAdmin
      .from('votes')
      .select('id')

    if (totalError) {
      console.error('Toplam oy sayısı hatası:', totalError)
      throw totalError
    }

    const totalVotes = totalVotesData?.length || 0

    // Bugünkü oy sayısı
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: todayVotesData, error: todayError } = await supabaseAdmin
      .from('votes')
      .select('id')
      .gte('created_at', today.toISOString())

    if (todayError) {
      console.error('Bugünkü oy sayısı hatası:', todayError)
      throw todayError
    }

    const todayVotes = todayVotesData?.length || 0

    // Son 1 saatteki oy sayısı
    const hourAgo = new Date()
    hourAgo.setHours(hourAgo.getHours() - 1)
    
    const { data: hourVotesData, error: hourError } = await supabaseAdmin
      .from('votes')
      .select('id')
      .gte('created_at', hourAgo.toISOString())

    if (hourError) {
      console.error('Saatlik oy sayısı hatası:', hourError)
      throw hourError
    }

    const lastHourVotes = hourVotesData?.length || 0

    // Video bazlı oy dağılımı
    const { data: videoData, error: videoError } = await supabaseAdmin
      .from('votes')
      .select('video_id')

    if (videoError) {
      console.error('Video bazlı oy dağılımı hatası:', videoError)
      throw videoError
    }

    const videoCounts: { [key: string]: number } = {}
    videoData?.forEach(vote => {
      if (vote.video_id) {
        videoCounts[vote.video_id] = (videoCounts[vote.video_id] || 0) + 1
      }
    })
    const videoStats = Object.entries(videoCounts)
      .map(([video_id, count]) => ({ video_id, count }))
      .sort((a, b) => b.count - a.count)

    // Platform dağılımı
    const { data: platformData, error: platformError } = await supabaseAdmin
      .from('votes')
      .select('platform')

    if (platformError) {
      console.error('Platform dağılımı hatası:', platformError)
      throw platformError
    }

    const platformCounts: { [key: string]: number } = {}
    platformData?.forEach(vote => {
      if (vote.platform) {
        platformCounts[vote.platform] = (platformCounts[vote.platform] || 0) + 1
      }
    })
    const platformStats = Object.entries(platformCounts)
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count)

    return {
      summary: {
        totalVotes,
        todayVotes,
        lastHourVotes
      },
      videoStats,
      platformStats
    }

  } catch (error) {
    console.error('İstatistik alma hatası:', error)
    if (error instanceof Error) {
      throw new Error(`İstatistik hatası: ${error.message}`)
    } else {
      throw new Error('İstatistikler alınırken beklenmeyen bir hata oluştu')
    }
  }
}

// Saatlik trendi işle
function processHourlyTrend(votes: any[]) {
  const hours: { [key: string]: number } = {}
  const now = new Date()

  // Son 24 saati sıfırla
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourKey = hour.toISOString().slice(0, 13) // YYYY-MM-DDTHH
    hours[hourKey] = 0
  }

  // Oyları saatlere göre grupla
  votes.forEach(vote => {
    if (vote.created_at) {
      const hourKey = new Date(vote.created_at).toISOString().slice(0, 13)
      if (hours[hourKey] !== undefined) {
        hours[hourKey]++
      }
    }
  })

  return Object.entries(hours).map(([hour, count]) => ({
    hour: new Date(hour).toLocaleTimeString('tr-TR', { hour: '2-digit' }),
    count
  }))
}

// Günlük trendi işle
function processDailyTrend(votes: any[]) {
  const days: { [key: string]: number } = {}
  const now = new Date()

  // Son 7 günü sıfırla
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayKey = day.toISOString().slice(0, 10) // YYYY-MM-DD
    days[dayKey] = 0
  }

  // Oyları günlere göre grupla
  votes.forEach(vote => {
    if (vote.created_at) {
      const dayKey = new Date(vote.created_at).toISOString().slice(0, 10)
      if (days[dayKey] !== undefined) {
        days[dayKey]++
      }
    }
  })

  return Object.entries(days).map(([day, count]) => ({
    day: new Date(day).toLocaleDateString('tr-TR', { weekday: 'short' }),
    count
  }))
} 