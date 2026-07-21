"use client"

import { useEffect, useState } from 'react'
import MarketingSite from './MarketingSite'
import { AuthProvider, useAuth } from './AuthContext'
import AccountApp from './AccountApp'

function Router({ initialPath }) {
  const [path, setPath] = useState(initialPath)
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    const navigate = () => setPath(window.location.pathname)
    window.addEventListener('popstate', navigate)
    window.addEventListener('bullyx:navigate', navigate)
    return () => { window.removeEventListener('popstate', navigate); window.removeEventListener('bullyx:navigate', navigate) }
  }, [])

  useEffect(() => {
    if (loading || !user || profile?.full_name || path === '/onboarding') return
    window.history.replaceState({}, '', '/onboarding')
    setPath('/onboarding')
  }, [loading, user, profile, path])

  if (path === '/' || path === '') return <MarketingSite />
  return <AccountApp path={path} />
}

export default function App({ initialPath = '/' }) {
  return <AuthProvider><Router initialPath={initialPath} /></AuthProvider>
}
