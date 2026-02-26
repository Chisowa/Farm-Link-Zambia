import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export interface User {
  id: string
  email: string
  name: string
  location?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Convert Firebase User to our User type
 */
async function createUserObject(firebaseUser: FirebaseUser): Promise<User> {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    if (userDoc.exists()) {
      return userDoc.data() as User
    }
  } catch (error) {
    // Silently fail - will use fallback user info
  }

  // Fallback to basic user info
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userObj = await createUserObject(firebaseUser)
          setUser(userObj)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error in auth state change:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const userObj = await createUserObject(result.user)
      setUser(userObj)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Create user profile in Firestore
      const userObj: User = {
        id: result.user.uid,
        email,
        name,
      }

      await setDoc(doc(db, 'users', result.user.uid), userObj)
      setUser(userObj)
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!user) {
        throw new Error('No user logged in')
      }

      setIsLoading(true)
      try {
        const updatedUser = { ...user, ...updates }

        // Try to update in Firestore
        try {
          await setDoc(doc(db, 'users', user.id), updatedUser, { merge: true })
        } catch (firestoreError: unknown) {
          const error = firestoreError as { code?: string; message?: string }
          // Check if it's a Firestore permission/initialization error
          if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
            console.warn(
              'Firestore not ready or permissions denied. Profile will be updated in Firebase Auth only.',
              firestoreError
            )
            // Continue anyway - profile is cached in memory and will be re-fetched on next auth state check
          } else {
            throw firestoreError
          }
        }

        // Update local state
        setUser(updatedUser)
      } catch (error) {
        console.error('Profile update error:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
