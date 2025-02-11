import { NextApiRequest, NextApiResponse } from 'next'

// Kullanılmış token'ları takip etmek için Set
const usedTokens = new Set<string>()

// Secret key'i environment variable'dan al
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { captchaValue } = req.body

  // Token daha önce kullanılmış mı kontrol et
  if (usedTokens.has(captchaValue)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Bu CAPTCHA token daha önce kullanılmış.' 
    })
  }

  try {
    // Google reCAPTCHA API'sine istek at
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captchaValue}`,
    })

    const data = await response.json()

    if (data.success) {
      // Token'ı kullanılmış olarak işaretle
      usedTokens.add(captchaValue)
      
      // 2 dakika sonra token'ı sil (temizlik için)
      setTimeout(() => {
        usedTokens.delete(captchaValue)
      }, 2 * 60 * 1000)

      return res.status(200).json({ success: true })
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'CAPTCHA doğrulaması başarısız.' 
      })
    }
  } catch (error) {
    console.error('CAPTCHA doğrulama hatası:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'CAPTCHA doğrulanırken bir hata oluştu.' 
    })
  }
} 