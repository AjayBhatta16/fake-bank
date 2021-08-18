import React, { useState } from 'react'
import StandardContainer from './StandardContainer'

export default function SignupScreen(props) {
    const [incorrectMsg, setIncorrectMsg] = useState('')
    // TODO: connect component to API here
    const handleSignup = (event) => {
        event.preventDefault()
        setIncorrectMsg('testing 123')
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
                            <input type="text" name="firstName" id="firstName" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="lastName" class="text-info">Last Name:</label><br />
                            <input type="text" name="lastName" id="lastName" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="username" class="text-info">Username:</label><br />
                            <input type="text" name="username" id="username" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="email" class="text-info">Email:</label><br />
                            <input type="text" name="email" id="email" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="phone" class="text-info">Phone Number:</label><br />
                            <input type="text" name="phone" id="phone" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="password" class="text-info">Password:</label><br />
                            <input type="password" name="password" id="password" class="form-control" />
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