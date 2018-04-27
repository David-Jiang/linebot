export const returnFloat = (num: string) => {
	let value = Math.round(parseFloat(num)*100) / 100
	let xsd = value.toString().split(".")
	if (xsd.length == 1) {
		value=value.toString()+".00"
		return value
	}
	if (xsd.length>1) {
		if (xsd[1].length<2) {
			value=value.toString() + "0"
		}
	return value;
	}
}

export const addToStockList = (stockId: string) => {
  if (!_.find(stockList, function(o) { return o.stockId == stockId; })) {
    let stock = Object.assign({}, stockInfo)
    stock.stockId = stockId
    stockList.push(stock)
  }
}