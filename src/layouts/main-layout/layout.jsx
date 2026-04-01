import React from 'react'
import Navbar from '../../components/navbar/navbar'

export default function Layout({children}) {
  return (
    <div className="min-h-screen text-black dark:text-white bg-white dark:bg-black">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}
