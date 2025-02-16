import React from 'react'
import formatCurrency from '../../utils/format-currency'
import formatAccountNumber from '../../utils/format-account-number'
import AccountActionButton from './AccountActionButton'
import deleteAccount from '../../utils/api/delete-account'
import * as AccountActions from '../../state/actions/account.actions'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function AccountRow(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const tokenID = useSelector(state => state.user.authToken.id)
    const userData = useSelector(state => state.user.userData)

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

    const handleExchange = exchangeType => {
        dispatch(AccountActions.accountSelectedForExchange(props.account))
        navigate('/accounts/'+exchangeType)
    }

    return (
        <tr>
            <td>
                {formatAccountNumber(props.account.accountNumber)}
            </td>
            <td>
                {props.account.accountType}
            </td>
            <td>
                {formatCurrency(props.account.amount)}
            </td>
            <td>
                <AccountActionButton 
                    action={() => handleExchange('withdraw')}
                    displayText="Withdraw"
                />
            </td>
            <td>
                <AccountActionButton 
                    action={() => handleExchange('deposit')}
                    displayText="Deposit"
                />
            </td>
            <td>
                <AccountActionButton 
                    action={() => handleExchange('transfer')}
                    displayText="Transfer"
                />
            </td>
            <td>
                <AccountActionButton 
                    action={() => handleDelete(props.account)}
                    displayText="Delete"
                />
            </td>
        </tr>
    )
}