
import './App.css'
import { AuthProvider } from './auth/context/auth-provider'
import { Router } from './router/sections'
import { GameProvider } from './game/context/game-provider'

function App() {

  return (
    <AuthProvider>
      <GameProvider>
        <Router />
      </GameProvider>
    </AuthProvider>
  )
}

export default App
