const generateRandomNumber = (length = 6) => {
    if (length <= 0) {
        throw new Error('Number length must be at least 6');
    }
    
    let result = '';
    for(let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return result;
}

module.exports = {
    generateRandomNumber
}