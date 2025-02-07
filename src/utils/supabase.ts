import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// IP adresi kontrolü için fonksiyon
export async function checkIfIpVoted(ip: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('voter_ip', ip)
    .single()

  if (error) {
    console.error('IP kontrol hatası:', error)
    return false
  }

  return !!data
}

// Oy kullanma fonksiyonu
export async function castVote(videoId: string, voterIp: string) {
  const hasVoted = await checkIfIpVoted(voterIp)
  
  if (hasVoted) {
    throw new Error('Bu IP adresi daha önce oy kullanmış.')
  }

  const { data, error } = await supabase
    .from('votes')
    .insert([
      {
        video_id: videoId,
        voter_ip: voterIp,
        voted_at: new Date().toISOString()
      }
    ])

  if (error) {
    console.error('Oy kullanma hatası:', error)
    throw error
  }

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