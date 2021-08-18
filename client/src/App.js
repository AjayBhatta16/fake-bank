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
  switch(screen) {
    case 'dashboard':
      return <DashboardScreen setScreen={setScreen} />
    case 'exchange':
      return <ExchangeScreen setScreen={setScreen} />
    case 'home':
      return <HomeScreen setScreen={setScreen} />
    case 'login':
      return <LoginScreen setScreen={setScreen} />
    case 'signup':
      return <SignupScreen setScreen={setScreen} />
    default:
      return <HomeScreen setScreen={setScreen} />
  }
}

export default App;
