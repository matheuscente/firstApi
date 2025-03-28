function productsReturn(movements) {
  const products = {};
  movements.forEach((element) => {
    if (!products[element.product.id]) {
      products[element.product.id] = {
        id: element.product.id,
        name: element.product.name,
        amount: 0,
      };
    }

    const currentAmount = products[element.product.id].amount;
    if (element.typeMoviment === "entry") {
      products[element.product.id].amount = currentAmount + element.amount;
    } else {
      products[element.product.id].amount = currentAmount - element.amount;
    }

    if (products[element.product.id].amount === 0) {
      delete products[element.product.id];
    }
  });

  return Object.values(products);
}

module.exports = productsReturn;
