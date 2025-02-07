import { useState } from 'react'
import Hero from '../components/Hero'
import VoteSection from '../components/VoteSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-900/40 to-black text-white">
      <Hero />
      <VoteSection />
      <Footer />
    </main>
  )
} 