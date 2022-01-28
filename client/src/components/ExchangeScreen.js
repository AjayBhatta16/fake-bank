import React, { useRef, useState } from 'react'
import StandardContainer from './StandardContainer'
import env from '../env'
import axios from 'axios'

export default function ExchangeScreen(props) {
    const [errMsg, setErrMsg] = useState('')
    const [toValue, setToValue] = useState(props.target.accountNumber ? props.target.accountNumber.toString() : null)
    const [fromValue, setFromValue] = useState(props.target.accountNumber ? props.target.accountNumber.toString() : null)
    const amountRef = useRef(null)
    const typeRef = useRef(null)
    const stopRedirect = event => event.preventDefault()
    const getTitle = () => {
        switch(props.type) {
            case 'add':
                return 'Open Account'
            case 'deposit':
                return 'Make A Deposit'
            case 'transfer':
                return 'Transfer Money'
            case 'withdraw':
                return 'Withdraw Money'
            default:
                return 'ERROR: Unknown exchange type'
        }
    }
    const handleAdd = async (type, amount) => {
        let accountCreated
        await axios.post(`${env.endpoint}/account/create`, {
            username: props.user.username,
            tokenId: props.token.id,
            type: type,
            amount: amount 
        }).then(res => {
            accountCreated = res.data
        }).catch(err => {
            setErrMsg('An unknown error has occurred')
            console.log(err)
        })
        if(!accountCreated.accountNumber) {
            if(accountCreated.msg) setErrMsg('Your login session has expired. Please refresh the page.')
            return false 
        }
        props.user.accounts.push(accountCreated)
        props.setUser(props.user)
        return true 
    }
    const handleDeposit = async (to, amount) => {
        let exchangeRes
        await axios.post(`${env.endpoint}/exchange`, {
            username: props.user.username,
            tokenId: props.token.id,
            to: parseInt(to),
            transactionType: 'deposit',
            amount: amount 
        }).then(res => {
            exchangeRes = res.data 
        }).catch(err => {
            setErrMsg('An unknown error has occurred')
            console.log(err)
        })
        props.user.accounts.forEach(account => {
            if(account.accountNumber == parseInt(to)) account.amount += amount
        })
        props.setUser(props.user)
        return exchangeRes.status == '200'
    }
    const handleTransfer = async (from, to, amount) => {
        let exchangeRes
        await axios.post(`${env.endpoint}/exchange`, {
            username: props.user.username,
            tokenId: props.token.id,
            from: parseInt(from),
            to: parseInt(to),
            transactionType: 'transfer',
            amount: amount 
        }).then(res => {
            exchangeRes = res.data 
        }).catch(err => {
            setErrMsg('An unknown error has occurred')
            console.log(err)
        })
        props.user.accounts.forEach(account => {
            if(account.accountNumber == parseInt(from)) {
                account.amount -= amount
            } 
            if(account.accountNumber == parseInt(to)) {
                account.amount += amount
            }
        })
        props.setUser(props.user)
        return exchangeRes.status == '200'
    }
    const handleWithdraw = async (from, amount) => {
        let exchangeRes
        await axios.post(`${env.endpoint}/exchange`, {
            username: props.user.username,
            tokenId: props.token.id,
            from: parseInt(from),
            transactionType: 'withdraw',
            amount: amount 
        }).then(res => {
            exchangeRes = res.data 
        }).catch(err => {
            setErrMsg('An unknown error has occurred')
            console.log(err)
        })
        props.user.accounts.forEach(account => {
            if(account.accountNumber == parseInt(from)) account.amount -= amount
        })
        props.setUser(props.user)
        return exchangeRes.status == '200'
    }
    const handleSubmit = async event => {
        event.preventDefault()
        let amount = parseFloat(amountRef.current.value)
        if(!amount) {
            setErrMsg('Amount must be a numerical value')
            return 
        }
        let type = typeRef.current.value.toLowerCase()
        if(props.type == 'add' && type != 'savings' && type != 'checking') {
            setErrMsg('Type must be savings or checking')
            return 
        }
        let to, from
        if(props.type == 'withdraw' || props.type == 'transfer') {
            from = fromValue
        }
        if(props.type == 'transfer' || props.type == 'deposit') {
            to = toValue
        }
        let exchangeResult = false 
        switch(props.type) {
            case 'add':
                exchangeResult = await handleAdd(type, amount)
                break
            case 'deposit':
                exchangeResult = await handleDeposit(to, amount)
                break 
            case 'transfer':
                exchangeResult = await handleTransfer(from, to, amount)
                break 
            case 'withdraw':
                exchangeResult = await handleWithdraw(from, amount)
                break 
            default:
                setErrMsg('ERROR: Invalid Transaction Type')
                return 
        }
        if(!exchangeResult) {
            if(errMsg != 'Your login session has expired. Please refresh the page.') {
                console.log(exchangeResult)
                setErrMsg('An unknown error has occurred')
            }
            return
        }
        props.setScreen('dashboard')
    }
    const handleToChange = event => {
        setToValue(event.target.value)
    }
    const handleFromChange = event => {
        setFromValue(event.target.value)
    }
    return (
        <StandardContainer>
            <div className="wrapper bg-dark">
                <div id="formContent">
                    <h1 className="text-white text-center">{getTitle()}</h1>
                    <form className="form" onSubmit={stopRedirect}>
                        {(props.type == 'withdraw' || props.type == 'transfer') ? (
                            <div className="form-group">
                                <label for="from" className="text-info">From:</label>
                                <select class="form-control" id="from" onChange={handleFromChange}>
                                    <option value={props.target.accountNumber.toString()}>{props.target.accountNumber} ({props.target.accountType})</option>
                                </select>
                            </div>
                        ) : null }
                        {(props.type == 'deposit' || props.type == 'transfer') ? (
                            <div className="form-group">
                                <label for="to" className="text-info">To:</label>
                                <select class="form-control" id="to" onChange={handleToChange}>
                                    {props.type == 'deposit' ? (
                                        <option value={props.target.accountNumber.toString()}>{props.target.accountNumber} ({props.target.accountType})</option>
                                    ) : props.user.accounts.map(acc => (
                                            <option value={acc.accountNumber.toString()}>{acc.accountNumber} ({acc.accountType})</option>
                                    ))}
                                </select>
                            </div>
                        ) : null }
                        <div className="form-group">
                            <label for="type" className="text-info">{props.type == 'add' ? 'Type' : 'Memo'}:</label>
                            <input 
                                type="text"
                                ref={typeRef}
                                name="type"
                                id="type"
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label for="amount" className="text-info">Amount:</label>
                            <input 
                                type="text"
                                ref={amountRef}
                                name="amount"
                                id="amount"
                                className="form-control"
                            />
                        </div>
                        <small id="errMsg" className="text-danger form-text">
                            {errMsg}
                        </small>
                        <div className="form-group">
                            <button
                                name="submit" 
                                className="btn btn-info btn-md" 
                                onClick={handleSubmit}
                            >Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </StandardContainer>
    )
}