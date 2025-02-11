import { NextApiRequest, NextApiResponse } from 'next'

const RECAPTCHA_SECRET_KEY = '6Lf6OtQqAAAAAIxdCS8Dxzzuh0166JvPs37bGokz'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { captchaValue } = req.body

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
      return res.status(200).json({ success: true })
    } else {
      return res.status(400).json({ success: false, message: 'CAPTCHA doğrulaması başarısız.' })
    }
  } catch (error) {
    console.error('CAPTCHA doğrulama hatası:', error)
    return res.status(500).json({ success: false, message: 'CAPTCHA doğrulanırken bir hata oluştu.' })
  }
} 