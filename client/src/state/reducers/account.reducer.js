import * as AccountActions from '../actions/account.actions'
import * as UserActions from '../actions/user.actions'

import parseTransactionList from '../../utils/parse-transaction-list'

const initialState = {
    errorMessage: '',
    successMessage: '',
    transactionHistory: [],
    selectedAccount: null,
}

export const accounts = (state = initialState, action) => {
    switch(action.type) {
        case AccountActions.TypeConstants.TRANSACTIONS_LOADED:
            return {
                ...state,
                transactionHistory: action.transactions,
            }
        case AccountActions.TypeConstants.EXCHANGE_ERROR:
            return {
                ...state,
                errorMessage: action.errorMessage,
            }
        case AccountActions.TypeConstants.DELETE_ACCOUNT_SUCCESS:
            return {
                ...state,
                successMessage: action.successMessage,
            }
        case AccountActions.TypeConstants.EXCHANGE_SUCCESS:
            return {
                ...state,
                transactionHistory: [
                    ...state.transactionHistory,
                    action.transaction,
                ],
            }
        case AccountActions.TypeConstants.ACCOUNT_SELECTED_FOR_EXCHANGE:
            return {
                ...state,
                selectedAccount: action.account,
            }
        case UserActions.TypeConstants.LOGIN_SUCCESS: 
            return {
                ...state,
                transactionHistory: parseTransactionList(action.userData.accounts)
            }
        default:
            return state
    }
}