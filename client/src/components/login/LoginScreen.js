import React, {useState, useRef} from 'react'
import StandardContainer from '../StandardContainer'
import AlternativeLink from '../common/AlternativeLink'
import FormErrorText from '../common/FormErrorText'
import FormTextInput from '../common/FormTextInput'
import stopRedirect from '../../utils/stop-redirect'
import login from '../../utils/api/login'
import FormSubmitButton from '../common/FormSubmitButton'
import { useNavigate } from 'react-router-dom'

export default function LoginScreen(props) {
    const navigate = useNavigate()
    const [incorrectMsg, setIncorrectMsg] = useState('')
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const handleLogin = async (event) => {
        event.preventDefault()
        const loginResult = await login(usernameRef.current.value, passwordRef.current.value)
        if (loginResult.incorrectMsg) {
            setIncorrectMsg(loginResult.incorrectMsg)
            return 
        }
        props.setToken(loginResult.token)
        props.setUser(loginResult.user)
        navigate('/dashboard')
    }
    return (
        <StandardContainer>
            <div className="wrapper bg-dark">
                <div id="formContent">
                    <h1 className="text-white text-center">Welcome Back</h1>
                    <form className="form" onSubmit={stopRedirect}>
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
                        <FormErrorText text={incorrectMsg} />
                        <FormSubmitButton 
                            onClick={handleLogin}
                            displayText="Log In"
                        />
                        <AlternativeLink 
                            setScreen={navigate}
                            text="No account? Sign up"
                            destination="signup"
                        />
                    </form>
                </div>
            </div>
        </StandardContainer>
    )
}