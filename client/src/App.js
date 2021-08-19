import logo from './logo.svg';
import './App.css';
import { useState } from 'react'
import DashboardScreen from './components/DashboardScreen'
import ExchangeScreen from './components/ExchangeScreen'
import HomeScreen from './components/HomeScreen'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'

function App() {
  const [screen, setScreen] = useState('home')
  const [token, setToken] = useState({})
  const [user, setUser] = useState({})
  switch(screen) {
    case 'dashboard':
      return <DashboardScreen setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} />
    case 'exchange':
      return <ExchangeScreen setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} />
    case 'home':
      return <HomeScreen setScreen={setScreen} />
    case 'login':
      return <LoginScreen setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} />
    case 'signup':
      return <SignupScreen setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} />
    default:
      return <HomeScreen setScreen={setScreen} />
  }
}

export default App;
