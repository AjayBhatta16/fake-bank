import React from 'react'
import StandardContainer from '../StandardContainer'
import FormSuccessText from '../common/FormSuccessText'
import FormErrorText from '../common/FormErrorText'
import TransactionTable from './TransactionTable'
import AccountTable from './AccountTable'
import parseName from '../../utils/parse-name'
import parseTransactionList from '../../utils/parse-transaction-list'
import deleteAccount from '../../utils/api/delete-account'
import * as AccountActions from '../../state/actions/account.actions'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export default function DashboardScreen() {
    const navigate = useNavigate()

    const userData = useSelector(state => state.user.userData)
    const tokenID = useSelector(state => state.user.authToken.id)
    const errorMessage = useSelector(state => state.account.errorMessage)
    const successMessage = useSelector(state => state.account.successMessage)

    const dispatch = useDispatch()

    const handleDelete = async account => {
        const deleteResult = await deleteAccount(userData.username, tokenID, account.accountNumber)
        if (deleteResult.success) {
            dispatch(AccountActions.deleteAccountSuccess({
                accountID: account.accountNumber,
                successMessage: deleteResult.msg,
            }))
        } else {
            dispatch(AccountActions.exchangeError({
                errorMessage: deleteResult.msg,
            }))
        }
    }

    return (
        <StandardContainer>
            <div className="custom-wide bg-dark">
                <h1 className="text-center text-white">{parseName(userData.fullName)}</h1>
                <AccountTable 
                    setScreen={navigate}
                    handleDelete={handleDelete}
                />
                <FormErrorText text={errorMessage} />
                <FormSuccessText text={successMessage} />
                <TransactionTable transactions={parseTransactionList(userData.accounts)} />
            </div>
        </StandardContainer>
    )
}