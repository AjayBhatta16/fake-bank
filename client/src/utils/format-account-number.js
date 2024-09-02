const formatAccountNumber = (number) => 
    number.toString()
            .split('')
            .map((ch, i) => {
                return i < 4 ? '*' : ch 
            })
            .join('')
export default formatAccountNumber