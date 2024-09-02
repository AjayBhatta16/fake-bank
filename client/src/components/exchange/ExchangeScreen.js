import React, { useRef, useState } from 'react'
import StandardContainer from '../StandardContainer'
import FormSubmitButton from '../common/FormSubmitButton'
import FormErrorText from '../common/FormErrorText'
import FormTextInput from '../common/FormTextInput'
import MaybeDisplay from '../common/MaybeDisplay'
import AccountDropdown from './AccountDropdown'
import stopRedirect from '../../utils/stop-redirect'
import formatExchangeWindowTitle from '../../utils/format-exchange-window-title'
import openAccount from '../../utils/api/open-account'
import deposit from '../../utils/api/deposit'
import internalTransfer from '../../utils/api/internal-transfer'
import withdraw from '../../utils/api/withdraw'
import externalTransfer from '../../utils/api/external-transfer'

export default function ExchangeScreen(props) {
    const [errMsg, setErrMsg] = useState('')
    const [toValue, setToValue] = useState(props.target.accountNumber ? props.target.accountNumber.toString() : null)
    const [fromValue, setFromValue] = useState(props.target.accountNumber ? props.target.accountNumber.toString() : null)
    const amountRef = useRef(null)
    const typeRef = useRef(null)
    const wireNumberRef = useRef(null)
    const handleAdd = async (type, amount) => {
        const accountCreated = await openAccount(props.user.username, props.token.id, type, amount)
        if (accountCreated.errMsg) {
            setErrMsg(accountCreated.errMsg)
            return false
        }
        props.user.accounts.push(accountCreated)
        props.setUser(props.user)
        return true 
    }
    const handleDeposit = async (to, amount, note) => {
        const depositAction = await deposit(props.token.id, to, amount, note, props.user)
        if (depositAction.errMsg) {
            setErrMsg(depositAction.errMsg)
            return false
        }
        props.setUser(depositAction.newUserData)
        return depositAction.exchangeRes.status == '200'
    }
    const handleTransfer = async (from, to, amount, note) => {
        const internalTransferAction = await internalTransfer(props.token.id, from, to, amount, note, props.user)
        if (internalTransferAction.errMsg) {
            setErrMsg(internalTransferAction.errMsg)
            return false
        }
        props.setUser(internalTransferAction.newUserData)
        return internalTransferAction.exchangeRes.status == '200'
    }
    const handleWithdraw = async (from, amount, note) => {
        const withdrawAction = await withdraw(props.token.id, from, amount, note, props.user)
        if (withdrawAction.errMsg) {
            setErrMsg(withdrawAction.errMsg)
            return false
        }
        props.setUser(withdrawAction.newUserData)
        return withdrawAction.exchangeRes.status == '200'
    }
    const handleWireTransfer = async (from, amount, note) => {
        const externalTransferAction = await externalTransfer(props.token.id, from, amount, note, wireNumberRef.current.value, props.user)
        if (externalTransferAction.errMsg) {
            setErrMsg(externalTransferAction.errMsg)
            return false
        }
        props.setUser(externalTransferAction.newUserData)
        return externalTransferAction.exchangeRes.status == '200'
    }
    const handleSubmit = async event => {
        event.preventDefault()
        let amount = parseFloat(amountRef.current.value)
        if(!amount && amount != 0) {
            setErrMsg('Amount must be a numerical value')
            return 
        }
        let type = typeRef.current.value.toLowerCase()
        if(props.type == 'add' && type != 'savings' && type != 'checking') {
            setErrMsg('Type must be savings or checking')
            return 
        }
        let exchangeResult = false 
        switch(props.type) {
            case 'add':
                exchangeResult = await handleAdd(type, amount)
                break
            case 'deposit':
                exchangeResult = await handleDeposit(toValue, amount, typeRef.current.value)
                break 
            case 'transfer':
                if (toValue == 'external') {
                    exchangeResult = await handleWireTransfer(fromValue, amount, typeRef.current.value)
                } else {
                    exchangeResult = await handleTransfer(fromValue, toValue, amount, typeRef.current.value)
                }
                break 
            case 'withdraw':
                exchangeResult = await handleWithdraw(fromValue, amount, typeRef.current.value)
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
    return (
        <StandardContainer>
            <div className="wrapper bg-dark">
                <div id="formContent">
                    <h1 className="text-white text-center">{formatExchangeWindowTitle(props.type)}</h1>
                    <form className="form" onSubmit={stopRedirect}>
                        <MaybeDisplay if={(props.type == 'withdraw' || props.type == 'transfer')}>
                            <AccountDropdown
                                formName="from"
                                displayName="From"
                                changeAction={event => setFromValue(event.target.value)}
                                accounts={[props.target]}
                            />
                        </MaybeDisplay>
                        <MaybeDisplay if={(props.type == 'deposit' || props.type == 'transfer')}>
                            <AccountDropdown 
                                formName="to"
                                displayName="To"
                                changeAction={event => setToValue(event.target.value)}
                                accounts={props.type == 'deposit' ? [props.target] : [...props.user.accounts]}
                                includeExternalOption={props.type == 'transfer'}
                            />
                        </MaybeDisplay>
                        <MaybeDisplay if={(props.type == 'transfer' && toValue == 'external')}>
                            <FormTextInput 
                                domRef={wireNumberRef}
                                formName="wire-number"
                                displayName="Wire Number"
                            />
                        </MaybeDisplay>
                        <FormTextInput 
                            domRef={typeRef}
                            formName="type"
                            displayName={props.type == 'add' ? 'Type' : 'Note'}
                        />
                        <FormTextInput 
                            domRef={amountRef}
                            formName="amount"
                            displayName="Amount"
                        />
                        <FormErrorText text={errMsg} />
                        <FormSubmitButton 
                            onClick={handleSubmit}
                            displayText="Submit"
                        />
                    </form>
                </div>
            </div>
        </StandardContainer>
    )
}