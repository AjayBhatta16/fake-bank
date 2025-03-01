export const TypeConstants = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_ERROR: 'LOGIN_ERROR',
    SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
    SIGNUP_ERROR: 'SIGNUP_ERROR',
}

export const loginSuccess = (userData, authToken) => ({
    type: TypeConstants.LOGIN_SUCCESS,
    userData,
    authToken,
})

export const loginError = (errorMessage) => ({
    type: TypeConstants.LOGIN_ERROR,
    errorMessage,
})

export const processLoginResult = (loginResponse) => {
    if (!!loginResponse.incorrectMsg) {
        return loginError(loginResponse.incorrectMsg)
    } else {
        return loginSuccess(loginResponse.user, loginResponse.token)
    }
}

export const signupSuccess = (userData, authToken) => ({
    type: TypeConstants.SIGNUP_SUCCESS,
    userData,
    authToken,
})

export const signupError = (errorMessage) => ({
    type: TypeConstants.SIGNUP_ERROR,
    errorMessage,
})

export const processSignupResult = (signupResponse) => {
    if (!!signupResponse.incorrectMsg) {
        return signupError(signupResponse.incorrectMsg)
    } else {
        return signupSuccess(signupResponse.user, signupResponse.token)
    }
}