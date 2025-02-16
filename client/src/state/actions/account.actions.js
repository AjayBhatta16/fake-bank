export const TypeConstants = {
    EXCHANGE_ERROR: 'EXCHANGE_ERROR',
    EXCHANGE_SUCCESS: 'EXCHANGE_SUCCESS',
    DELETE_ACCOUNT_SUCCESS: 'DELETE_ACCOUNT_SUCCESS',
    CREATE_ACCOUNT_SUCCESS: 'CREATE_ACCOUNT_SUCCESS',
    TRANSACTIONS_LOADED: 'TRANSACTIONS_LOADED',
    ACCOUNT_SELECTED_FOR_EXCHANGE: 'ACCOUNT_SELECTED_FOR_EXCHANGE',
}

export const ExchangeType = {
    DELETE: 'DELETE',
    CREATE: 'CREATE',
    DEPOSIT: 'DEPOSIT',
    WITHDRAW: 'WITHDRAW',
    TRANSFER_INTERNAL: 'TRANSFER_INTERNAL',
    TRANSFER_EXTERNAL: 'TRANSFER_EXTERNAL',
}

export const exchangeError = (errorMessage) => ({
    type: TypeConstants.EXCHANGE_ERROR,
    errorMessage,
})

export const exchangeSuccess = (exchangeType, transaction) => ({
    type: TypeConstants.EXCHANGE_SUCCESS,
    exchangeType,
    transaction,
})

function getExchangeType(typeParam, toAccountID) {
    if (typeParam === 'add') 
        return ExchangeType.CREATE

    if (typeParam === 'deposit') 
        return ExchangeType.DEPOSIT

    if (typeParam === 'withdraw')
        return ExchangeType.WITHDRAW

    if (typeParam === 'transfer' && toAccountID === 'external')
        return ExchangeType.TRANSFER_EXTERNAL

    if (typeParam === 'transfer' && toAccountID !== 'external')
        return ExchangeType.TRANSFER_INTERNAL

    return null
}

export const processExchangeResult = (exchangeResult, type) => {
    if (!!exchangeResult.errMsg || exchangeResult.exchangeRes?.status !== '200') {
        return exchangeError(exchangeResult.errMsg ?? 'An unknown error has occurred')
    }

    const exchangeType = getExchangeType(type, exchangeResult.transaction.toAccount)
    if (exchangeType === ExchangeType.CREATE) {
        return createAccountSuccess(exchangeResult)
    }

    return exchangeSuccess(exchangeType, exchangeResult.transaction)
}

export const deleteAccountSuccess = (accountID, successMessage) => ({
    type: TypeConstants.DELETE_ACCOUNT_SUCCESS,
    accountID,
    successMessage,
})

export const createAccountSuccess = (account) => ({
    type: TypeConstants.CREATE_ACCOUNT_SUCCESS,
    account,
})

export const transactionsLoaded = (transactions) => ({
    type: TypeConstants.TRANSACTIONS_LOADED,
    transactions,
})

export const accountSelectedForExchange = (account) => ({
    type: TypeConstants.ACCOUNT_SELECTED_FOR_EXCHANGE,
    account,
})