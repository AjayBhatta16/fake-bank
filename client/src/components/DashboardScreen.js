import React, {useState} from 'react'
import Account from './dashboard/Account'
import StandardContainer from './StandardContainer'
import env from '../env'
import axios from 'axios'
import Transaction from './dashboard/Transaction'

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
    const transactions = props.user.accounts
        .reduce((accum, current) => [...accum, ...current.transactions], [])
        .sort((t1, t2) => t1.timestamp > t2.timestamp ? -1 : 1)
        .filter(txn => !txn.hideOnTable)
    return (
        <StandardContainer>
            <div className="custom-wide bg-dark">
                <h1 className="text-center text-white">{lastName}, {firstName}</h1>
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-dark">
                        <thead>
                            <tr>
                                <th colspan="5">Your accounts</th>
                                <th colSpan="2">
                                    <div className='float-right'>
                                        <button 
                                            className="btn btn-primary btn-sm my-0" 
                                            onClick={handleAdd}
                                        >+ New Account</button>
                                    </div>
                                </th>
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
                
                <div className='table-responsive mt-3'>
                    <table className='table table-striped table-hover table-dark'>
                        <thead>
                            <tr>
                                <th colSpan="6">Transaction History</th>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Amount</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length == 0 ? (
                                <tr>
                                    <td colspan="6">No accounts found for this user</td>
                                </tr>
                            ) : null}
                            {
                                transactions.map(txn => (
                                    <Transaction transaction={txn} />
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </StandardContainer>
    )
}