import React, { useState } from 'react'
import { useAuthContext } from '../../auth/hooks'
import { Icon } from '@iconify/react'
import ThemeToggle from '../../theme/components/theme-toggle'

export default function Navbar() {
  const { user } = useAuthContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMusicOn, setIsMusicOn] = useState(true)

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left side - User name */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.fullName || 'Guest'}
                  </p>
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>
                      Balance: <span className="font-semibold">{user?.wallet?.balance}</span> TND
                    </div>
                    <div>
                      Winnings: <span className="font-semibold">{user?.wallet?.winnings}</span> TND
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle - Game Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              CHICKEN GAME
            </h1>
          </div>

          {/* Right side - Music toggle and Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Music Toggle */}
            <button
              onClick={() => setIsMusicOn(!isMusicOn)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isMusicOn ? "Mute music" : "Play music"}
            >
              <Icon 
                icon={isMusicOn ? "mdi:volume-high" : "mdi:volume-off"} 
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
              />
            </button>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon 
                  icon="mdi:dots-vertical" 
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                />
              </button>
            </div>

            {/* Desktop Menu Dropdown */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon 
                  icon="mdi:account-circle" 
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="py-1">
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Icon icon="mdi:account" className="w-4 h-4 mr-3" />
                      Profile
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Icon icon="mdi:cog" className="w-4 h-4 mr-3" />
                      Settings
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="py-2">
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon icon="mdi:account" className="w-4 h-4 mr-3" />
                Profile
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon icon="mdi:cog" className="w-4 h-4 mr-3" />
                Settings
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
