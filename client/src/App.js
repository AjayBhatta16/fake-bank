import logo from './logo.svg';
import './App.css';
import DashboardScreen from './components/DashboardScreen'
import ExchangeScreen from './components/ExchangeScreen'
import HomeScreen from './components/HomeScreen'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
