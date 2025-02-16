import * as UserActions from '../actions/user.actions'
import * as AccountActions from '../actions/account.actions'

const initialState = {
    userData: {},
    authToken: {},
    errorMessage: '',
}

export const user = (state = initialState, action) => {
    switch(action.type) {
        case UserActions.TypeConstants.LOGIN_SUCCESS:
        case UserActions.TypeConstants.SIGNUP_SUCCESS:
            return {
                ...state,
                userData: action.userData,
                authToken: action.authToken,
            }
        case UserActions.TypeConstants.LOGIN_ERROR:
        case UserActions.TypeConstants.SIGNUP_ERROR:
            return {
                ...state,
                errorMessage: action.errorMessage,
            }
        case AccountActions.TypeConstants.DELETE_ACCOUNT_SUCCESS:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    accounts: state.userData.accounts.filter(
                        acc => acc.accountNumber !== action.accountID,
                    )
                }
            }
        case AccountActions.TypeConstants.CREATE_ACCOUNT_SUCCESS:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    accounts: [
                        ...state.userData.accounts,
                        action.account,
                    ],
                }
            }
        case AccountActions.TypeConstants.EXCHANGE_SUCCESS:
            const newUserData = {...state.userData}

            newUserData.accounts.forEach(acc => {
                if (acc.accountNumber === action.transaction.toAccount) {
                    acc.amount += action.transaction.amount
                }

                if (acc.accountNumber === action.transaction.fromAccount) {
                    acc.amount -= action.transaction.amount
                }
            })

            return {
                ...state,
                userData: newUserData,
            }
        default:
            return state
    }
}