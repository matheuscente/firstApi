function productsReturn(movements) {
    const products = {}
    movements.forEach(element => {

        if(!products[element.product.id]) {
            products[element.product.id] = {
                id: element.product.id,
                name: element.product.name,
                amount: 0
            }
        }

        const amountChange = products[element.product.id].amount  
        if(element.typeMoviment === "entry") {
            products[element.product.id].amount = amountChange + element.amount
        } else {
            products[element.product.id].amount = amountChange - element.amount
        }

        
      
    });

    return Object.values(products)
}

module.exports = productsReturn

