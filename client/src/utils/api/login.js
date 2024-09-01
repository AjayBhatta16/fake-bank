import axios from 'axios' 
import env from '../../env'

const login = async (username, password) => {
    let token, user
    if (!username || username == '') {
        return {
            incorrectMsg: 'Username field is required'
        }
    }
    if (!password || password == '') {
        return {
            incorrectMsg: 'Password field is required'
        }
    }
    await axios.post(`${env.endpoint}/user/verify`, {
        username: username,
        password: password
    }).then(res => {
        token = res.data
    }).catch(error => {
        console.log(error)
        return {
            incorrectMsg: 'An unknown error has occured'
        }
    })
    if(!token.id) {
        return {
            incorrectMsg: 'Incorrect username or password'
        }
    }
    await axios.post(`${env.endpoint}/token/verify`, {
        username: token.username,
        tokenId: token.id
    }).then(res => {
        user = res.data
    }).catch(error => {
        console.log(error)
        return {
            incorrectMsg: 'An unknown error has occured'
        }
    })
    if(!user || !user.id) {
        return {
            incorrectMsg: 'Server Error: Try again later'
        }
    }
    return { token, user }
}

export default login