import './App.css';
import { useState } from 'react'
import DashboardScreen from './components/DashboardScreen'
import ExchangeScreen from './components/ExchangeScreen'
import HomeScreen from './components/HomeScreen'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import env from './env'

function App() {
  const [screen, setScreen] = useState('home')
  const [token, setToken] = useState({})
  const [user, setUser] = useState({})
  const [targetAccount, setTargetAccount] = useState({})
  document.title = env.bankName
  switch(screen) {
    case 'dashboard':
      return <DashboardScreen setTarget={setTargetAccount} setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} />
    case 'add':
      return <ExchangeScreen target={targetAccount} setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} type="add" />
    case 'deposit':
      return <ExchangeScreen target={targetAccount} setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} type="deposit" />
    case 'withdraw':
      return <ExchangeScreen target={targetAccount} setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} type="withdraw" />
    case 'transfer':
      return <ExchangeScreen target={targetAccount} setScreen={setScreen} setToken={setToken} setUser={setUser} token={token} user={user} type="transfer" />
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
