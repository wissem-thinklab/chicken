import React from 'react'
import ThemeToggle from '../../theme/components/theme-toggle'

export default function AuthSplitLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 relative">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
            
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🐔</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chicken Game</h2>
            </div>
            
            {children}
            
            {/* Footer links */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                &copy; 2024 Chicken Game. All rights reserved.
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <a href="#" className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Game branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20" />
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white">
          <div className="text-center max-w-lg">
            {/* Main branding */}
            <div className="mb-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                <span className="text-5xl">🐔</span>
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                Chicken Game
              </h1>
              <p className="text-xl mb-2 opacity-90">The Ultimate Gaming Experience</p>
              <p className="text-sm opacity-75">Battle, Compete, Conquer</p>
            </div>
            
            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="text-3xl mb-2">🎮</div>
                <h3 className="font-semibold mb-1">Epic Battles</h3>
                <p className="text-sm opacity-75">Real-time multiplayer combat</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-semibold mb-1">Tournaments</h3>
                <p className="text-sm opacity-75">Compete for glory</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-semibold mb-1">Global Rankings</h3>
                <p className="text-sm opacity-75">Climb the leaderboard</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Custom Challenges</h3>
                <p className="text-sm opacity-75">Test your skills</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="opacity-75">Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1M+</div>
                <div className="opacity-75">Battles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="opacity-75">Online</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-red-400 opacity-20 rounded-full blur-xl animate-pulse" />
      </div>
    </div>
  )
}