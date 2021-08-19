import React, { useState, useRef } from 'react'
import StandardContainer from './StandardContainer'
import env from '../env'
import axios from 'axios'

export default function SignupScreen(props) {
    const [incorrectMsg, setIncorrectMsg] = useState('')
    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const phoneRef = useRef(null)
    const passwordRef = useRef(null)
    const handleSignup = async (event) => {
        event.preventDefault()
        let token
        let user = {
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            username: usernameRef.current.value,
            email: emailRef.current.value,
            phoneNumber: phoneRef.current.value,
            password: passwordRef.current.value
        }
        if(!user.firstName || !user.lastName || !user.username || !user.email || !user.phoneNumber || !user.password) {
            setIncorrectMsg('All of these fields are required')
            return 
        }
        await axios.post(`${env.endpoint}/user/create`, user).then(res => {
            token = res.data
        }).catch(err => {
            setIncorrectMsg('An unknown error has occurred')
            console.log(err)
        })
        if(!token || !token.id) {
            if(token) setIncorrectMsg(token.msg)
            return 
        }
        await axios.post(`${env.endpoint}/token/verify`, {
            username: token.username,
            tokenId: token.id 
        }).then(res => {
            user = res.data 
        }).catch(err => {
            setIncorrectMsg('An unknown error has occurred')
            console.log(err)
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
            <div className="wrapper bg-dark signup">
                <div id="formContent">
                    <h1 className="text-white text-center">Join This Bank</h1>
                    <form className="form" onSubmit={stopRedirect}>
                        <div class="form-group">
                            <label for="firstName" class="text-info">First Name:</label><br />
                            <input 
                                type="text"
                                ref={firstNameRef} 
                                name="firstName" 
                                id="firstName" 
                                class="form-control" 
                            />
                        </div>
                        <div class="form-group">
                            <label for="lastName" class="text-info">Last Name:</label><br />
                            <input 
                                type="text" 
                                ref={lastNameRef}
                                name="lastName" 
                                id="lastName" 
                                class="form-control" 
                            />
                        </div>
                        <div class="form-group">
                            <label for="username" class="text-info">Username:</label><br />
                            <input 
                                type="text" 
                                ref={usernameRef}
                                name="username" 
                                id="username"
                                class="form-control" 
                            />
                        </div>
                        <div class="form-group">
                            <label for="email" class="text-info">Email:</label><br />
                            <input 
                                type="text"
                                ref={emailRef} 
                                name="email" 
                                id="email" 
                                class="form-control" 
                            />
                        </div>
                        <div class="form-group">
                            <label for="phone" class="text-info">Phone Number:</label><br />
                            <input 
                                type="text" 
                                ref={phoneRef}
                                name="phone" 
                                id="phone" 
                                class="form-control" 
                            />
                        </div>
                        <div class="form-group">
                            <label for="password" class="text-info">Password:</label><br />
                            <input 
                                type="password" 
                                ref={passwordRef}
                                name="password" 
                                id="password" 
                                class="form-control" 
                            />
                        </div>
                        <small id="badSubmission" className="text-danger form-text">
                            {incorrectMsg}
                        </small>
                        <div class="form-group">
                            <button
                                name="submit" 
                                class="btn btn-info btn-md" 
                                onClick={handleSignup}
                            >Sign Up</button>
                        </div>
                        <div id="register-link" class="text-right">
                            <a 
                                href="#" 
                                class="text-info" 
                                onClick={() => {props.setScreen('login')}}
                            >Already a member? Log in</a>
                        </div>
                    </form>
                </div>
            </div>
        </StandardContainer>
    )
}