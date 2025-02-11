import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tarayıcı cache kontrolü için fonksiyon
function checkBrowserVote(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('hasVoted') === 'true'
}

// Tarayıcıya oy kullanıldı bilgisini kaydet
function setBrowserVote(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('hasVoted', 'true')
}

// IP adresi kontrolü için fonksiyon
export async function checkIfVoted(ip: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('voter_ip', ip)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('IP kontrol hatası:', error)
    return false
  }

  return !!data
}

// Platform bilgisini al
function getPlatformInfo(): string {
  if (typeof window === 'undefined') return 'unknown'

  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const browserInfo = {
    chrome: /chrome/i.test(userAgent),
    safari: /safari/i.test(userAgent),
    firefox: /firefox/i.test(userAgent),
    opera: /opera/i.test(userAgent),
    edge: /edge/i.test(userAgent),
    mobile: /mobile/i.test(userAgent)
  }

  let browser = 'Diğer'
  if (browserInfo.chrome) browser = 'Chrome'
  else if (browserInfo.safari) browser = 'Safari'
  else if (browserInfo.firefox) browser = 'Firefox'
  else if (browserInfo.opera) browser = 'Opera'
  else if (browserInfo.edge) browser = 'Edge'

  return `${platform} - ${browser}${browserInfo.mobile ? ' (Mobile)' : ''}`
}

// Oy kullanma fonksiyonu güncelleniyor
export async function castVote(videoId: string, voterIp: string) {
  const hasVoted = await checkIfVoted(voterIp)
  
  if (hasVoted) {
    throw new Error('Bu tarayıcı veya IP adresi ile daha önce oy kullanılmış.')
  }

  const platformInfo = getPlatformInfo()

  const { data, error } = await supabase
    .from('votes')
    .insert([
      {
        video_id: videoId,
        voter_ip: voterIp,
        platform: platformInfo,
        voted_at: new Date().toISOString()
      }
    ])

  if (error) {
    console.error('Oy kullanma hatası:', error)
    throw error
  }

  // Oy başarılı olduysa tarayıcıya kaydet
  setBrowserVote()

  return data
}

// Toplam oy sayısını getir
export async function getVoteCount(videoId: string): Promise<number> {
  const { count, error } = await supabase
    .from('votes')
    .select('id', { count: 'exact' })
    .eq('video_id', videoId)

  if (error) {
    console.error('Oy sayımı hatası:', error)
    return 0
  }

  return count || 0
} 