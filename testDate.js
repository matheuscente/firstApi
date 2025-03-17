
const createdAt = new Date('2025-03-17T00:53:14.000Z').getTime()
const atualDate = new Date().getTime()
const day = 86400000

let validade = day * 30

validade = createdAt + validade

function getValidade(a, b) {
    const resto = a - b
    const value = resto / day
    return value
}

console.log(getValidade(validade, atualDate))