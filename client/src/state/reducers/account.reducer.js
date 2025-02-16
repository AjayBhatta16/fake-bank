import * as AccountActions from '../actions/account.actions'

const initialState = {
    errorMessage: '',
    successMessage: '',
    transactionHistory: [],
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
        default:
            return state
    }
}