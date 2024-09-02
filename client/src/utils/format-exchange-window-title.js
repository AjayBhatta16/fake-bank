const formatExchangeWindowTitle = (type) => {
    switch(type) {
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
export default formatExchangeWindowTitle