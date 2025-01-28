import './App.css';
import { useState } from 'react'
import DashboardScreen from './components/dashboard/DashboardScreen'
import ExchangeScreen from './components/exchange/ExchangeScreen'
import HomeScreen from './components/home/HomeScreen'
import LoginScreen from './components/login/LoginScreen'
import SignupScreen from './components/signup/SignupScreen'
import env from './env'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// testing
function App() {
  const [token, setToken] = useState({})
  const [user, setUser] = useState({})
  const [targetAccount, setTargetAccount] = useState({})
  document.title = env.bankName

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <><Outlet/></> }>
          <Route index element={
            <HomeScreen />
          }/>
          <Route path="login" element={
            <LoginScreen 
              setUser={setUser}
              setToken={setToken}
            />
          }/>
          <Route path="signup" element={
            <SignupScreen
              setUser={setUser}
              setToken={setToken}
            />
          }/>
          <Route path="dashboard" element={
            <DashboardScreen
              setTarget={setTargetAccount}
              setUser={setUser}
              setToken={setToken}
              user={user}
              token={token}
            />
          }/>
          <Route path="accounts/:transactionType" element={
            <ExchangeScreen
              setUser={setUser}
              setToken={setToken}
              user={user}
              token={token}
              target={targetAccount}
            />
          }/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;