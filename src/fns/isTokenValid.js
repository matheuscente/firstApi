
function isTokenValid(date, currentDate) {
    let dateCreate = date
    const day = 86400000
    let validate = day * 7
    dateCreate = dateCreate.getTime()
    validate = dateCreate + validate

    return validate > currentDate
}

module.exports = isTokenValid
