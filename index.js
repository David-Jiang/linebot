const linebot = require('linebot')
const express = require('express')
//const rp = require('request-promise')
const _ = require('lodash')
import rp from 'request-promise'

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const app = express()

const linebotParser = bot.parser()

app.post('/linewebhook', linebotParser)

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.')
})

const userInfo = {
	userId: '',
	stockIdArr: [],
	subscr: false
};
let userInfoArr = []

const stockInfo = {
	stockId: '',
	stockName: '',
	startPrice: 0.0,
	currPrice: 0.0,
	lowPrice: 0.0,
	hightPrice: 0.0
};
let stockList = []

bot.on('message', function (event) {
	event.source.profile().then(function (profile) {
		if (!_.find(userInfoArr, function(o) { return o.userId == profile.userId })) {
			userInfo.userId = profile.userId
			userInfoArr.push(userInfo)
		}
		switch (event.message.type) {
			case 'text':
				if (_.startsWith(event.message.text,'-a')) {
					let stockIdArrBySplit = event.message.text.replace('-a','').trim().split("-")
					let index = _.findIndex(userInfoArr, function(o) { return o.userId === profile.userId })
					let userStockIdArr = userInfoArr[index].stockIdArr
					
					_.forEach(stockIdArrBySplit , function(stockId) { 
						if (stockId.length == 4) {
							if (_.includes(userStockIdArr, stockId)) {
								event.reply('您好' + profile.displayName + '，股票代號:' + stockId + "\n已經存在推播清單囉")
							} else {
								userInfoArr[index].subscr = true
								addToStockList(stockId)
								event.reply('您好' + profile.displayName + '，已成功開啟推播\n股票代號:' + stockId)
								userStockIdArr.push(stockId)
							}
						}
					})

				} else if (_.startsWith(event.message.text,'-r')) {
					let userInfo = _.find(userInfoArr, function(o) { return o.userId === profile.userId; })
					userInfo.subscr = false
					event.reply('您好' + profile.displayName + '，已取消推播')
				} else if (_.startsWith(event.message.text,'-c')) {
					let stockIdArrBySplit = event.message.text.replace('-c','').trim().split("-")
					_.forEach(stockIdArrBySplit , function(stockId) { 
						if (stockId.length == 4) {
							addToStockList(stockId)
							let showMessage = ''
							let obj = _.find(stockList, function(o) { return o.stockId == stockId && o.currPrice > 0 })
							if (obj) {
								showMessage += "股票:" + obj.stockName + "(" + obj.stockId + ")" + "\n目前價:" + obj.currPrice + "(" + 
									(obj.currPrice - obj.startPrice > 0 ? "+" : "") + returnFloat(obj.currPrice - obj.startPrice) + ")\n" +
									"最高價:" + obj.hightPrice + "\n最低價:" + obj.lowPrice + "\n"
									event.reply(showMessage)
							}
						}
					})

				} else {
					event.reply('您好' + profile.displayName + '，能否為您效勞？')
				}
				break;
			case 'sticker':
				event.reply({
					type: 'sticker',
					packageId: 1,
					stickerId: 4
				});
				break;
		default:
				event.reply('請輸入正確訊息唷')
				break;
	
		}
	})
})

setInterval(function() {
	_.forEach(userInfoArr, function(vo) {
		if (vo.subscr && vo.stockIdArr.length > 0) {
			let showMessage = ''
			_.forEach(vo.stockIdArr , function(stockId) {
				let obj = _.find(stockList, function(o) { return o.stockId == stockId && o.currPrice > 0 })
				if (obj) {
					showMessage += "股票:" + obj.stockName + "(" + obj.stockId + ")" + "\n目前價:" + obj.currPrice + "(" + 
						(obj.currPrice - obj.startPrice > 0 ? "+" : "") + returnFloat(obj.currPrice - obj.startPrice) + ")\n" +
						"最高價:" + obj.hightPrice + "\n最低價:" + obj.lowPrice + "\n"
				}
			})

			if (showMessage) {
				bot.push(vo.userId, {
					type: 'text',
					text: showMessage
				})
			}
		}
	});
} ,60000)


const jar = rp.jar()
const reqOpt = {
	uri: "http://mis.twse.com.tw/stock/fibest.jsp?lang=zh_tw",
	jar,
  headers:
  	{
    	'content-type': 'application/json'
    }
}
rp(reqOpt)
	.then(function (repos) {
		setInterval(function() {
			let temp = ''
			_.forEach(stockList , function(stockVO) { 
  			temp += 'tse_' + stockVO.stockId + '.tw' + '%7c'
			});
			reqOpt.uri = "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?_=" + Date.now() + "&ex_ch=" + temp.substring(0, temp.length - 3)
			if (stockList.length > 0) {
				rp(reqOpt)
				.then(function (repos) {
					var jsonObject = JSON.parse(repos)
					
					_.forEach(jsonObject.msgArray , function(vo) { 
						let info = _.find(stockList, function(o) { return o.stockId == vo.ch.replace(".tw","") })
						info.startPrice = vo.y
						info.lowPrice = vo.l
						info.hightPrice = vo.h
						info.currPrice = vo.z
						info.stockName = vo.n
					})
				})
				.catch(function (err) {
					console.log("getStockInfo發生錯誤:" + err)
				})
			}
		} ,20000)
	})
	.catch(function (err) {
		console.log("前導網頁get cookie發生錯誤:" + err)
	})

	function returnFloat(num) {
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

	function addToStockList(stockId) {
		if (!_.find(stockList, function(o) { return o.stockId == stockId; })) {
			let stock = Object.assign({}, stockInfo)
			stock.stockId = stockId
			stockList.push(stock)
		}
	}

