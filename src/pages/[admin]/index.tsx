import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { adminLogin, verifyMFA, completeMFASetup, checkAdminSession } from '../../utils/adminAuth'
import toast from 'react-hot-toast'
import Image from 'next/image'
import ReCAPTCHA from 'react-google-recaptcha'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { admin } = context.params as { admin: string }
  
  // Sadece doğru admin URL'i ile erişime izin ver
  if (admin !== 'dashboard-feray-x8k2p9') {
    return {
      notFound: true // Bu 404 sayfasına yönlendirecek
    }
  }

  return {
    props: {}
  }
}

export default function AdminPanel() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [mfaState, setMfaState] = useState<{
    type: 'INITIAL' | 'MFA_REQUIRED' | 'MFA_SETUP'
    factorId?: string
    qrCode?: string
    secret?: string
  }>({ type: 'INITIAL' })

  // Oturum kontrolü
  useEffect(() => {
    const checkSession = async () => {
      const isAdmin = await checkAdminSession()
      if (isAdmin) {
        router.push('/dashboard-feray-x8k2p9/panel')
      } else {
        // Oturum yoksa MFA state'i temizle
        setMfaState({ type: 'INITIAL' })
        localStorage.removeItem('mfaState')
      }
    }
    checkSession()
  }, [router])

  // MFA durumunu localStorage'da sakla
  useEffect(() => {
    const savedMfaState = localStorage.getItem('mfaState')
    if (savedMfaState) {
      const parsedState = JSON.parse(savedMfaState)
      // Sadece geçerli bir oturum varsa MFA state'i yükle
      checkAdminSession().then(isAdmin => {
        if (isAdmin) {
          setMfaState(parsedState)
        } else {
          localStorage.removeItem('mfaState')
        }
      })
    }
  }, [])

  useEffect(() => {
    if (mfaState.type !== 'INITIAL') {
      localStorage.setItem('mfaState', JSON.stringify(mfaState))
    } else {
      localStorage.removeItem('mfaState')
    }
  }, [mfaState])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const ipResponse = await fetch('/api/getIp')
      const { ip } = await ipResponse.json()
      
      await adminLogin(email, password, ip, captchaToken || undefined)
      router.push('/dashboard-feray-x8k2p9/panel')
    } catch (error: any) {
      if (error.type === 'MFA_REQUIRED') {
        setMfaState({ 
          type: 'MFA_REQUIRED', 
          factorId: error.factorId 
        })
      } else if (error.type === 'MFA_SETUP_REQUIRED') {
        setMfaState({
          type: 'MFA_SETUP',
          factorId: error.factorId,
          qrCode: error.qr,
          secret: error.secret
        })
      } else {
        setError(error.message || 'Giriş başarısız')
        toast.error(error.message || 'Giriş başarısız')
        // Hata durumunda MFA state'i ve CAPTCHA'yı temizle
        setMfaState({ type: 'INITIAL' })
        setCaptchaToken(null)
        recaptchaRef.current?.reset()
        localStorage.removeItem('mfaState')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (mfaState.type === 'MFA_REQUIRED' && mfaState.factorId) {
        await verifyMFA(mfaState.factorId, mfaCode)
      } else if (mfaState.type === 'MFA_SETUP' && mfaState.factorId) {
        await completeMFASetup(mfaState.factorId, mfaCode)
      }
      
      // MFA başarılı olduğunda state'i temizle
      setMfaState({ type: 'INITIAL' })
      localStorage.removeItem('mfaState')
      router.push('/dashboard-feray-x8k2p9/panel')
    } catch (error: any) {
      setError(error.message || 'MFA doğrulaması başarısız')
      toast.error(error.message || 'MFA doğrulaması başarısız')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>404 - Sayfa Bulunamadı</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-yellow-900/40 to-black">
        <div className="container mx-auto px-4 h-screen flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            {mfaState.type === 'INITIAL' ? (
              <form onSubmit={handleLogin} className="bg-black/50 backdrop-blur-lg p-8 rounded-xl border border-yellow-500/20">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Admin Girişi</h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-yellow-200 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-black/30 border border-yellow-500/20 rounded-lg 
                               text-yellow-100 placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-yellow-200 mb-1">
                      Şifre
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-black/30 border border-yellow-500/20 rounded-lg 
                               text-yellow-100 placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="flex justify-center mt-4">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                      onChange={(token) => setCaptchaToken(token)}
                      theme="dark"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !captchaToken}
                  className={`w-full mt-6 px-6 py-3 rounded-lg font-semibold text-black
                            transition-all duration-300 transform hover:scale-105
                            ${(isLoading || !captchaToken)
                              ? 'bg-yellow-600 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700'
                            }`}
                >
                  {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyMFA} className="bg-black/50 backdrop-blur-lg p-8 rounded-xl border border-yellow-500/20">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
                  {mfaState.type === 'MFA_SETUP' ? 'MFA Kurulumu' : 'MFA Doğrulama'}
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {mfaState.type === 'MFA_SETUP' && mfaState.qrCode && (
                  <div className="mb-6 text-center">
                    <p className="text-yellow-200 mb-4">
                      Google Authenticator uygulamasını açın ve QR kodu tarayın:
                    </p>
                    <div className="inline-block p-4 bg-white rounded-lg mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mfaState.qrCode}
                        alt="MFA QR Code"
                        width={200}
                        height={200}
                      />
                    </div>
                    {mfaState.secret && (
                      <div className="text-yellow-200 text-sm">
                        <p className="mb-2">Veya bu kodu manuel olarak girin:</p>
                        <code className="bg-black/30 px-3 py-1 rounded">{mfaState.secret}</code>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="mfaCode" className="block text-sm font-medium text-yellow-200 mb-1">
                    {mfaState.type === 'MFA_SETUP' 
                      ? 'Uygulamadaki 6 haneli kodu girin'
                      : 'Doğrulama kodunu girin'
                    }
                  </label>
                  <input
                    type="text"
                    id="mfaCode"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full px-4 py-2 bg-black/30 border border-yellow-500/20 rounded-lg 
                             text-yellow-100 placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || mfaCode.length !== 6}
                  className={`w-full mt-6 px-6 py-3 rounded-lg font-semibold text-black
                            transition-all duration-300 transform hover:scale-105
                            ${(isLoading || mfaCode.length !== 6)
                              ? 'bg-yellow-600 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700'
                            }`}
                >
                  {isLoading ? 'Doğrulanıyor...' : 'Doğrula'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
    </>
  )
} 