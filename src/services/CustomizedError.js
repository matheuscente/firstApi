class error{
    contructor(message) {
        this.message = message
        this.name = 'customized error'
        this.stack = new Error().stack;
    }
}

module.exports = new error()