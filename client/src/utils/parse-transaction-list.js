const parseTransactionList = (accounts) => {
    return accounts
        .reduce((accum, current) => [...accum, ...current.transactions], [])
        .sort((t1, t2) => t1.timestamp > t2.timestamp ? -1 : 1)
        .filter(txn => !txn.hideFromTable)
}
export default parseTransactionList