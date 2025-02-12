import { supabase } from './supabase'
import { Session } from '@supabase/supabase-js'
import rateLimiter from '../lib/rate-limit'

// SVG'yi base64'e dönüştür
function svgToBase64(svg: string): string {
  if (typeof window === 'undefined') return ''
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

// Admin oturumunu kontrol et
export async function checkAdminSession(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return false

  // Admin rolünü kontrol et
  const { data: adminData, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (error || !adminData) return false

  // MFA durumunu kontrol et
  const { data: mfaData } = await supabase.auth.mfa.listFactors()
  const factors = mfaData?.all || []
  const verifiedFactor = factors.find((factor: any) => factor.status === 'verified')

  // MFA kurulu ve doğrulanmış değilse oturumu kapat
  if (!verifiedFactor) {
    await supabase.auth.signOut()
    return false
  }

  // Son MFA doğrulama zamanını kontrol et
  const lastMfaVerification = localStorage.getItem('lastMfaVerification')
  const mfaTimeout = 30 * 60 * 1000 // 30 dakika

  if (!lastMfaVerification || Date.now() - parseInt(lastMfaVerification) > mfaTimeout) {
    await supabase.auth.signOut()
    return false
  }

  return true
}

// Admin girişi yap
export async function adminLogin(email: string, password: string, ip: string, captchaToken?: string) {
  try {
    // Rate limiting kontrolü
    rateLimiter(ip, 'admin_login')

    // CAPTCHA doğrulaması
    if (!captchaToken) {
      throw new Error('Lütfen robot olmadığınızı doğrulayın')
    }

    // CAPTCHA'yı doğrula
    const captchaResponse = await fetch('/api/verify-captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ captchaValue: captchaToken }),
    })

    const captchaData = await captchaResponse.json()
    if (!captchaData.success) {
      throw new Error('CAPTCHA doğrulaması başarısız')
    }

    // Önce mevcut oturumu kapat
    await supabase.auth.signOut()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken // Supabase'e de CAPTCHA token'ı gönder
      }
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email veya şifre hatalı')
      }
      throw error
    }

    // Session ID'yi yenile
    await supabase.auth.refreshSession()

    // Admin rolünü kontrol et
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', data.user?.id)
      .single()

    if (adminError || !adminData) {
      await supabase.auth.signOut()
      throw new Error('Yetkisiz erişim')
    }

    // MFA durumunu kontrol et
    const { data: mfaData, error: mfaError } = await supabase.auth.mfa.listFactors()
    
    if (mfaError) {
      throw new Error('MFA kontrolü sırasında bir hata oluştu')
    }

    const factors = mfaData?.all || []
    const verifiedFactor = factors.find((factor: any) => factor.status === 'verified')

    // MFA doğrulaması gerekiyor
    throw {
      type: 'MFA_REQUIRED',
      factorId: verifiedFactor ? verifiedFactor.id : factors[0]?.id
    }
  } catch (error) {
    throw error
  }
}

// MFA doğrulama
export async function verifyMFA(factorId: string, code: string) {
  try {
    // Rate limiting kontrolü
    rateLimiter('mfa', 'mfa_verify')

    const { data: challenge } = await supabase.auth.mfa.challenge({
      factorId
    })

    if (!challenge) {
      throw new Error('MFA doğrulaması başarısız')
    }

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code
    })

    if (error) {
      throw new Error('MFA doğrulaması başarısız')
    }

    // Session'ı yenile
    await supabase.auth.refreshSession()
    
    // MFA doğrulama zamanını kaydet
    const timestamp = Date.now().toString()
    localStorage.setItem('lastMfaVerification', timestamp)
    localStorage.setItem('mfaVerificationId', `${factorId}-${timestamp}`)

    return data
  } catch (error) {
    throw error
  }
}

// MFA kurulumunu tamamla
export async function completeMFASetup(factorId: string, code: string) {
  const { data: challenge } = await supabase.auth.mfa.challenge({
    factorId
  })

  if (!challenge) {
    throw new Error('MFA kurulumu başarısız')
  }

  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code
  })

  if (error) {
    throw new Error('MFA kurulumu başarısız')
  }

  return data
}

// Çıkış yap
export async function adminLogout() {
  localStorage.removeItem('lastMfaVerification')
  await supabase.auth.signOut()
} 