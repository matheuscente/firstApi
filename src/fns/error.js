function error(message) {
    const msg = message || "an error as ocurred"
    const error = new Error(msg)
    error.code = 1
    return error
}

module.exports = error