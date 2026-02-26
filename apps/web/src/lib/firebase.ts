/**
 * Firebase Configuration & Initialization
 * This file sets up Firebase with all necessary services: Auth, Firestore, Storage
 */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDgyiSYg7rmcIIL_uILxBSPfpt4I7qp0KM',
  authDomain: 'farmlink-zambia.firebaseapp.com',
  projectId: 'farmlink-zambia',
  storageBucket: 'farmlink-zambia.firebasestorage.app',
  messagingSenderId: '200648616564',
  appId: '1:200648616564:web:a3e66c99a5a4564dafbf21',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
