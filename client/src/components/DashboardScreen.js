import React, {useState} from 'react'
import Account from './dashboard/Account'
import StandardContainer from './StandardContainer'
import env from '../env'
import axios from 'axios'

export default function DashboardScreen(props) {
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [dashboardUser, setDashboardUser] = useState(props.user)
    const handleAdd = () => {
        props.setScreen('add')
    }
    const handleDelete = async account => {
        await axios.post(`${env.endpoint}/account/delete`, {
            username: props.user.username,
            tokenId: props.token.id,
            accountNumber: account.accountNumber
        }).then(res => {
            if(res.data.accountDeleted) {
                setSuccessMsg('Account deleted successfully')
                props.user.accounts = props.user.accounts.filter(bankAccount => bankAccount.accountNumber != account.accountNumber)
                props.setUser(props.user)
                setDashboardUser({...props.user})
            } else {
                setErrMsg('An unknown error has occurred')
            }
        }).catch(error => {
            setErrMsg('An unknown error has occurred')
            console.log(error)
        })
    }
    const firstName = props.user.fullName.split(' ')[0]
    const lastName = props.user.fullName.split(' ').slice(1).join(' ')
    return (
        <StandardContainer>
            <div className="custom-wide bg-dark">
                <h1 className="text-center text-white">{lastName}, {firstName}</h1>
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-dark">
                        <thead>
                            <tr>
                                <th colspan="2">Your accounts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.user.accounts.length == 0 ? (
                                <tr>
                                    <td colspan="7">No accounts found for this user</td>
                                </tr>
                            ) : null}
                            {
                                dashboardUser.accounts.map(account => (
                                    <Account 
                                        account={account} 
                                        setScreen={props.setScreen} 
                                        setTarget={props.setTarget}
                                        handleDelete={handleDelete}
                                    />    
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <small id="errMsg" className="text-danger form-text">
                    {errMsg}
                </small>
                <small id="successMsg" className="text-success form-text">
                    {successMsg}
                </small>
                <button className="btn btn-primary btn-lg" onClick={handleAdd}>New Account</button>
            </div>
        </StandardContainer>
    )
}