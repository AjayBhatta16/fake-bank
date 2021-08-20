import React, { useRef, useState } from 'react'
import StandardContainer from './StandardContainer'
import env from '../env'
import axios from 'axios'

export default function ExchangeScreen(props) {
    const [errMsg, setErrMsg] = useState('')
    const fromRef = useRef(null)
    const toRef = useRef(null)
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
    const handleSubmit = event => {
        event.preventDefault()
        let amount = parseFloat(amountRef.current.value)
        if(!amount) {
            setErrMsg('Amount must be a numerical value')
            return 
        }

        props.setScreen('dashboard')
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
                                <select class="form-control" id="from">
                                    <option>{props.target.accountNumber} ({props.target.accountType})</option>
                                </select>
                            </div>
                        ) : null }
                        {(props.type == 'deposit' || props.type == 'transfer') ? (
                            <div className="form-group">
                                <label for="to" className="text-info">To:</label>
                                <select class="form-control" id="to">
                                    {props.type == 'deposit' ? (
                                        <option>{props.target.accountNumber} ({props.target.accountType})</option>
                                    ) : props.user.accounts.map(acc => (
                                            <option>{acc.accountNumber} ({acc.accountType})</option>
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