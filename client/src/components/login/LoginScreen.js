import React, { useRef } from 'react'
import StandardContainer from '../StandardContainer'
import AlternativeLink from '../common/AlternativeLink'
import FormErrorText from '../common/FormErrorText'
import FormTextInput from '../common/FormTextInput'
import login from '../../utils/api/login'
import FormSubmitButton from '../common/FormSubmitButton'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as UserActions from '../../state/actions/user.actions'
import FormContainer from '../common/FormContainer'

export default function LoginScreen() {
    const navigate = useNavigate()

    const usernameRef = useRef(null)
    const passwordRef = useRef(null)

    const errorMessage = useSelector(state => state.user.errorMessage)
    const dispatch = useDispatch()

    const handleLogin = async (event) => {
        event.preventDefault()

        const loginResult = await login(usernameRef.current.value, passwordRef.current.value)
        dispatch(UserActions.processLoginResult(loginResult))
        
        if (!loginResult.incorrectMsg) {
            navigate('/dashboard')
        }
    }

    return (
        <StandardContainer>
            <FormContainer headerText="Welcome Back">
                <FormTextInput 
                    domRef={usernameRef}
                    displayName="Username"
                    formName="username"
                />
                <FormTextInput
                    domRef={passwordRef}
                    displayName="Password"
                    formName="password"
                    password="true"
                />
                <FormErrorText text={errorMessage} />
                <FormSubmitButton 
                    onClick={handleLogin}
                    displayText="Log In"
                />
                <AlternativeLink 
                    setScreen={navigate}
                    text="No account? Sign up"
                    destination="signup"
                />
            </FormContainer>
        </StandardContainer>
    )
}