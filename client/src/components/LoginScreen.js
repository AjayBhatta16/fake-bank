import React, {useState, useRef} from 'react'
import StandardContainer from './StandardContainer'
import env from '../env'
import axios from 'axios' 

export default function LoginScreen(props) {
    const [incorrectMsg, setIncorrectMsg] = useState('')
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const handleLogin = async (event) => {
        event.preventDefault()
        let token, user
        await axios.post(`${env.endpoint}/user/verify`, {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }).then(res => {
            token = res.data
        }).catch(error => {
            setIncorrectMsg('An unknown error has occured')
            console.log(error)
        })
        if(!token || !token.id) {
            if(token) setIncorrectMsg('Incorrect username or password')
            return 
        }
        await axios.post(`${env.endpoint}/token/verify`, {
            username: token.username,
            tokenId: token.id
        }).then(res => {
            user = res.data
        }).catch(error => {
            setIncorrectMsg('An unknown error has occured')
            console.log(error)
        })
        if(!user || !user.id) {
            setIncorrectMsg('Server Error: Try again later')
            return 
        }
        props.setToken(token)
        props.setUser(user)
        props.setScreen('dashboard')
    }
    const stopRedirect = event => event.preventDefault()
    return (
        <StandardContainer>
            <div className="wrapper bg-dark">
                <div id="formContent">
                    <h1 className="text-white text-center">Welcome Back</h1>
                    <form className="form" onSubmit={stopRedirect}>
                        <div className="form-group">
                            <label for="username" className="text-info">Username:</label><br />
                            <input 
                                type="text" 
                                ref={usernameRef} 
                                name="username" 
                                id="username" 
                                className="form-control" 
                            />
                        </div>
                        <div className="form-group">
                            <label for="password" className="text-info">Password:</label><br />
                            <input 
                                type="password" 
                                ref={passwordRef}
                                name="password" 
                                id="password" 
                                className="form-control" 
                            />
                        </div>
                        <small id="wrongPassword" className="text-danger form-text">
                            {incorrectMsg}
                        </small>
                        <div className="form-group">
                            <button
                                name="submit" 
                                className="btn btn-info btn-md" 
                                onClick={handleLogin}
                            >Log In</button>
                        </div>
                        <div id="register-link" className="text-right">
                            <a 
                                href="#" 
                                className="text-info" 
                                onClick={() => {props.setScreen('signup')}}
                            >No account? Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </StandardContainer>
    )
}