const { is } = require("bluebird")

function isTokenValid(date) {
    let dateCreate = date
    const day = 86400000
    let validate = day * 7
    dateCreate = dateCreate.getTime()
    validate = dateCreate + validate
    const atualDate = new Date().getTime()

    if(validate - atualDate <= 0 ) {
        return false
    }
    return true
}

module.exports = isTokenValid
