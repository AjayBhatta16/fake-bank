import React, { useState, useRef } from 'react'
import StandardContainer from '../StandardContainer'
import AlternativeLink from '../common/AlternativeLink'
import FormSubmitButton from '../common/FormSubmitButton'
import FormErrorText from '../common/FormErrorText'
import FormTextInput from '../common/FormTextInput'
import stopRedirect from '../../utils/stop-redirect'
import signup from '../../utils/api/signup'

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
        let user = {
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            username: usernameRef.current.value,
            email: emailRef.current.value,
            phoneNumber: phoneRef.current.value,
            password: passwordRef.current.value
        }
        const signupResult = await signup(user)
        if (signupResult.incorrectMsg) {
            setIncorrectMsg(signupResult.incorrectMsg)
            return
        }
        props.setToken(signupResult.token)
        props.setUser(signupResult.user)
        props.setScreen('dashboard')
    }
    return (
        <StandardContainer>
            <div className="wrapper bg-dark signup">
                <div id="formContent">
                    <h1 className="text-white text-center">Join This Bank</h1>
                    <form className="form" onSubmit={stopRedirect}>
                        <FormTextInput 
                            domRef={firstNameRef}
                            displayName="First Name"
                            formName="firstName"
                        />
                        <FormTextInput 
                            domRef={lastNameRef}
                            displayName="Last Name"
                            formName="lastName"
                        />
                        <FormTextInput 
                            domRef={usernameRef}
                            displayName="Username"
                            formName="username"
                        />
                        <FormTextInput 
                            domRef={emailRef}
                            displayName="E-Mail"
                            formName="email"
                        />
                        <FormTextInput 
                            domRef={phoneRef}
                            displayName="Phone Number"
                            formName="phone"
                        />
                        <FormTextInput
                            domRef={passwordRef}
                            displayName="Password"
                            formName="password"
                            password="true"
                        />
                        <FormErrorText text={incorrectMsg} />
                        <FormSubmitButton 
                            onClick={handleSignup}
                            displayText="Sign Up"
                        />
                        <AlternativeLink 
                            setScreen={props.setScreen}
                            text="Already a member? Log in"
                            destination="login"
                        />
                    </form>
                </div>
            </div>
        </StandardContainer>
    )
}