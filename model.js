export class UserInfo {
	constructor(userId, stockIdArr = [], subscr = false) {
		this.userId = userId;
		this.stockIdArr = stockIdArr;
		this.subscr = subscr;
	}
}

export class StockInfo {
	constructor(stockId, stockName = '', startPrice = 0.0, currPrice = 0.0, lowPrice = 0.0, hightPrice = 0.0) {
		this.stockId = stockId;
		this.stockName = stockName;
		this.startPrice = startPrice;
		this.currPrice = currPrice;
		this.lowPrice = lowPrice;
		this.hightPrice = hightPrice;
	}
}

export class CarouselTemplate {
	constructor(type = 'template', altText = 'Carousel alt text', template = { type: 'carousel', columns: [] }) {
		this.type = type;
		this.altText = altText;
		this.template = template;
	}
}

export class CarouselModel {
	constructor(thumbnailImageUrl = '', title = '', text = '', actions: []) {
		this.thumbnailImageUrl = thumbnailImageUrl;
		this.title = title;
		this.text = text;
		this.actions = actions;
	}
}
/* { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
{ label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
{ label: 'Say message', type: 'message', text: 'Rice=米' }, */
