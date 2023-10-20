import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore'
// ... other firebase imports

export const firebaseApp = initializeApp({

    apiKey: "AIzaSyBnw_P3TBV5Pyk840iFLNGM2K9fm72d1d8",
  
    authDomain: "rps100-1fe72.firebaseapp.com",
  
    projectId: "rps100-1fe72",
  
    storageBucket: "rps100-1fe72.appspot.com",
  
    messagingSenderId: "423487676392",
  
    appId: "1:423487676392:web:9f55723a2e1e2cbbce0e5d",
  
    measurementId: "G-4FHX7HGJ24"
  
  })

// used for the firestore refs
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

// // here we can export reusable database references
export const gamesRef = collection(db, 'games')