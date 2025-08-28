"use client"

import Link from "next/link"
import { Home } from "lucide-react" 

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="w-16 h-16 relative flex items-center justify-center rounded-full bg-[#B5CC22] text-white shadow-lg hover:scale-110 transition-transform duration-300">
        <Home size={32} strokeWidth={2.5} />
      </div>
    </Link>
  )
}