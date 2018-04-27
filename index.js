const linebot = require('linebot')
const express = require('express')
const rp = require('request-promise')
const _ = require('lodash')
//import {aObject} from './text'

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
					
					let responseSuccessId = [];
					_.forEach(stockIdArrBySplit , function(stockId) { 
						if (stockId.length == 4) {
							if (!_.includes(userStockIdArr, stockId)) {
								userInfoArr[index].subscr = true
								addToStockList(stockId)
								userStockIdArr.push(stockId)
								responseSuccessId.push(stockId)
							}
						}
					})
					if (responseSuccessId.length > 0) {
						event.reply('您好' + profile.displayName + '，已成功開啟推播\n股票代號:' + responseSuccessId.join(','))
					}

				} else if (_.startsWith(event.message.text,'-r')) {
					let stockIdArrBySplit = event.message.text.replace('-r','').trim().split("-")
					let userInfo = _.find(userInfoArr, function(o) { return o.userId === profile.userId; })

					if (stockIdArrBySplit.length > 0) {
						_.forEach(stockIdArrBySplit , function(stockIdneedDel) { 
							_.forEach(userInfo.stockIdArr, function(stockIdown) {
								_.remove(userInfo.stockIdArr, function(n) {return stockIdneedDel == stockIdown})
							})
						})
						event.reply('您好' + profile.displayName + "，股票代號:" +stockIdArrBySplit.join(',') + '，已移除推播清單')
					} else {
						userInfo.subscr = false
						event.reply('您好' + profile.displayName + '，已暫停推播')
					}
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

				} else if (_.startsWith(event.message.text,'-v')) {
					let showMessage = "";
					showMessage += "輸入-a 股票代號 可定時推播該股票資訊\n\t(例如: -a 2353-2330)\n"
					showMessage += "輸入-c 股票代號 可回應該股票資訊\n\t(例如: -c 2353-2330)\n"
					showMessage += "輸入-r 可暫停推播\n"
					showMessage += "輸入-r 股票代號 可移除該股票資訊推播\n\t(例如: -r 2353-2330)\n"
					showMessage += ""
					event.reply(showMessage)
				} else {
					event.reply('您好' + profile.displayName + '，歡迎使用\n輸入-v 可以查看功能列表')
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
let count = 1
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
					if (!!jsonObject.msgArray) {
						console.log(count++ + "次")
					}
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

