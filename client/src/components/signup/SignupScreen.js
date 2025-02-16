import React, { useState, useRef } from 'react'
import StandardContainer from '../StandardContainer'
import AlternativeLink from '../common/AlternativeLink'
import FormSubmitButton from '../common/FormSubmitButton'
import FormErrorText from '../common/FormErrorText'
import FormTextInput from '../common/FormTextInput'
import FormContainer from '../common/FormContainer'
import signup from '../../utils/api/signup'
import * as UserActions from '../../state/actions/user.actions'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export default function SignupScreen() {
    const navigate = useNavigate()

    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const phoneRef = useRef(null)
    const passwordRef = useRef(null)

    const errorMessage = useSelector(state => state.user.errorMessage)
    const dispatch = useDispatch()

    const handleSignup = async (event) => {
        event.preventDefault()

        const signupResult = await signup({
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            username: usernameRef.current.value,
            email: emailRef.current.value,
            phoneNumber: phoneRef.current.value,
            password: passwordRef.current.value
        })

        dispatch(UserActions.processSignupResult(signupResult))

        if (!signupResult.incorrectMsg) {
            navigate('/dashboard')
        }
    }
    return (
        <StandardContainer>
            <FormContainer headerText="Join This Bank">
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
                <FormErrorText text={errorMessage} />
                <FormSubmitButton 
                    onClick={handleSignup}
                    displayText="Sign Up"
                />
                <AlternativeLink 
                    setScreen={navigate}
                    text="Already a member? Log in"
                    destination="login"
                />
            </FormContainer>
        </StandardContainer>
    )
}