"use client"

import { useEffect } from "react"
import { getUserFromCookies } from "./utils"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function Home() {
    const { user = {} } = getUserFromCookies() || {}
    if (user?.id) {
        redirect('/dashboard')
    }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Welcome to the app</h1>
      <Link href="/login">Login</Link>
    </div>
  )
}
