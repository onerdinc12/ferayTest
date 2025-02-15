import { useState } from 'react'
import Hero from '../components/Hero'
import VoteSection from '../components/VoteSection'
import Footer from '../components/Footer'

export default function SaygiBiz() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <VoteSection />
      <Footer isSaygiBiz={true} />
    </main>
  )
} 