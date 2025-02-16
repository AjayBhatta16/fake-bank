import React, { useRef, useState } from 'react'
import StandardContainer from '../StandardContainer'
import FormSubmitButton from '../common/FormSubmitButton'
import FormErrorText from '../common/FormErrorText'
import FormTextInput from '../common/FormTextInput'
import FormContainer from '../common/FormContainer'
import MaybeDisplay from '../common/MaybeDisplay'
import AccountDropdown from './AccountDropdown'
import formatExchangeWindowTitle from '../../utils/format-exchange-window-title'
import openAccount from '../../utils/api/open-account'
import deposit from '../../utils/api/deposit'
import internalTransfer from '../../utils/api/internal-transfer'
import withdraw from '../../utils/api/withdraw'
import externalTransfer from '../../utils/api/external-transfer'
import * as AccountActions from '../../state/actions/account.actions'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

export default function ExchangeScreen(props) {
    const [toValue, setToValue] = useState(props.target.accountNumber?.toString())
    const [fromValue, setFromValue] = useState(props.target.accountNumber?.toString())

    const amountRef = useRef(null)
    const typeRef = useRef(null)
    const wireNumberRef = useRef(null)

    const navigate = useNavigate()
    const { transactionType } = useParams()

    const userData = useSelector(state => state.user.userData)
    const tokenID = useSelector(state => state.user.authToken.id)
    const errorMessage = useSelector(state => state.account.errorMessage)
    
    const dispatch = useDispatch()
    
    const handleSubmit = async event => {
        event.preventDefault()

        let amount = parseFloat(amountRef.current.value)
        if(!amount && amount != 0) {
            return dispatch(AccountActions.exchangeError({
                errorMessage: 'Amount must be a numerical value',
            }))
        }

        let type = typeRef.current.value.toLowerCase()
        if(transactionType == 'add' && type != 'savings' && type != 'checking') {
            return dispatch(AccountActions.exchangeError({
                errorMessage: 'Type must be savings or checking',
            }))
        }

        let exchangeResult = null 
        switch(transactionType) {
            case 'add':
                exchangeResult = await openAccount(userData.username, tokenID, type, amount)
            case 'deposit':
                exchangeResult = await deposit(tokenID, toValue, amount, typeRef.current.value, userData)
            case 'transfer':
                if (toValue == 'external') {
                    exchangeResult = await externalTransfer(tokenID, fromValue, amount, typeRef.current.value, wireNumberRef.current.value, userData)
                } else {
                    exchangeResult = await internalTransfer(tokenID, fromValue, toValue, amount, typeRef.current.value, userData)
                }
            case 'withdraw':
                exchangeResult = await withdraw(tokenID, fromValue, amount, typeRef.current.value, userData)
        }

        dispatch(AccountActions.processExchangeResult(exchangeResult))

        navigate('/dashboard')
    }
    return (
        <StandardContainer>
            <FormContainer headerText={formatExchangeWindowTitle(transactionType)}>
                <MaybeDisplay if={(transactionType == 'withdraw' || transactionType == 'transfer')}>
                    <AccountDropdown
                        formName="from"
                        displayName="From"
                        changeAction={event => setFromValue(event.target.value)}
                        accounts={[props.target]}
                    />
                </MaybeDisplay>
                <MaybeDisplay if={(transactionType == 'deposit' || transactionType == 'transfer')}>
                    <AccountDropdown 
                        formName="to"
                        displayName="To"
                        changeAction={event => setToValue(event.target.value)}
                        accounts={transactionType == 'deposit' ? [props.target] : [...userData.accounts]}
                        includeExternalOption={transactionType == 'transfer'}
                    />
                </MaybeDisplay>
                <MaybeDisplay if={(transactionType == 'transfer' && toValue == 'external')}>
                    <FormTextInput 
                        domRef={wireNumberRef}
                        formName="wire-number"
                        displayName="Wire Number"
                    />
                </MaybeDisplay>
                <FormTextInput 
                    domRef={typeRef}
                    formName="type"
                    displayName={transactionType == 'add' ? 'Type' : 'Note'}
                />
                <FormTextInput 
                    domRef={amountRef}
                    formName="amount"
                    displayName="Amount"
                />
                <FormErrorText text={errorMessage} />
                <FormSubmitButton 
                    onClick={handleSubmit}
                    displayText="Submit"
                />
            </FormContainer>
        </StandardContainer>
    )
}