export class UserInfo {
	constructor(userId, stockIdArr = [], subscr = false) {
			this.userId = userId
			this.stockIdArr = stockIdArr
			this.subscr = subscr
	}
}

export class StockInfo {
	constructor(stockId, stockName = '', startPrice = 0.0, currPrice = 0.0, lowPrice = 0.0, hightPrice = 0.0) {
			this.userId = userId
			this.stockIdArr = stockIdArr
			this.subscr = subscr
	}
}