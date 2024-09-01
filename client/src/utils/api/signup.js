import axios from 'axios' 
import env from '../../env'

const signup = async (user) => {
    if(!user.firstName || !user.lastName || !user.username || !user.email || !user.phoneNumber || !user.password) {
        return {
            incorrectMsg: 'All of these fields are required'
        }
    }
    let token
    await axios.post(`${env.endpoint}/user/create`, user).then(res => {
        token = res.data
    }).catch(err => {
        console.log(err)
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
    }).catch(err => {
        console.log(err)
        return {
            incorrectMsg: 'An unknown error has occured'
        }
    })
    if(!user || !user.id) {
        return {
            incorrectMsg: 'Server Error: Try again later'
        } 
    }
    return { user, token }
}
export default signup