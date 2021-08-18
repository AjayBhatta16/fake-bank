import React, {useState} from 'react'
import StandardContainer from './StandardContainer'

export default function LoginScreen(props) {
    const [incorrectMsg, setIncorrectMsg] = useState('')
    // TODO: connect component to API here
    const handleLogin = (event) => {
        event.preventDefault()
        setIncorrectMsg('testing 123')
    }
    const stopRedirect = event => event.preventDefault()
    return (
        <StandardContainer>
            <div className="wrapper bg-dark">
                <div id="formContent">
                    <h1 className="text-white text-center">Welcome Back</h1>
                    <form className="form" onSubmit={stopRedirect}>
                        <div class="form-group">
                            <label for="username" class="text-info">Username:</label><br />
                            <input type="text" name="username" id="username" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="password" class="text-info">Password:</label><br />
                            <input type="password" name="password" id="password" class="form-control" />
                        </div>
                        <small id="wrongPassword" className="text-danger form-text">
                            {incorrectMsg}
                        </small>
                        <div class="form-group">
                            <button
                                name="submit" 
                                class="btn btn-info btn-md" 
                                onClick={handleLogin}
                            >Log In</button>
                        </div>
                        <div id="register-link" class="text-right">
                            <a 
                                href="#" 
                                class="text-info" 
                                onClick={() => {props.setScreen('signup')}}
                            >No account? Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </StandardContainer>
    )
}