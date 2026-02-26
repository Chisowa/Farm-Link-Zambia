import React, { createContext, useContext, useState, useEffect } from 'react'

export type PageType =
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'advisory'
  | 'crops'
  | 'weather'
  | 'profile'

interface NavigationContextType {
  currentPage: PageType
  navigateTo: (page: PageType) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('landing')

  // Restore page from localStorage on mount
  useEffect(() => {
    const savedPage = localStorage.getItem('lastPage') as PageType | null
    if (savedPage && ['dashboard', 'advisory', 'crops', 'weather', 'profile'].includes(savedPage)) {
      setCurrentPage(savedPage)
    }
  }, [])

  const navigateTo = (page: PageType) => {
    setCurrentPage(page)
    // Save to localStorage
    localStorage.setItem('lastPage', page)
    window.scrollTo(0, 0)
  }

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
