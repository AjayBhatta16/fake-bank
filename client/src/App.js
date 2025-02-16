import './App.css';
import DashboardScreen from './components/dashboard/DashboardScreen'
import ExchangeScreen from './components/exchange/ExchangeScreen'
import HomeScreen from './components/home/HomeScreen'
import LoginScreen from './components/login/LoginScreen'
import SignupScreen from './components/signup/SignupScreen'
import env from './env'
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

function App() {
  document.title = env.bankName

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <><Outlet/></> }>
          <Route index element={ <HomeScreen /> }/>
          <Route path="login" element={ <LoginScreen/> }/>
          <Route path="signup" element={ <SignupScreen/> }/>
          <Route path="dashboard" element={ <DashboardScreen/> }/>
          <Route path="accounts/:transactionType" element={ <ExchangeScreen/> }/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;