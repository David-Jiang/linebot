const linebot = require('linebot')
const express = require('express')
const rp = require('request-promise')
const _ = require('lodash')
import {returnFloat} from './util'
import {UserInfo, StockInfo} from './model'

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

let userInfoArr = []

/* const stockInfo = {
	stockId: '',
	stockName: '',
	startPrice: 0.0,
	currPrice: 0.0,
	lowPrice: 0.0,
	hightPrice: 0.0
}; */
let stockList = []

bot.on('message', function (event) {
	event.source.profile().then(function (profile) {
		if (!_.find(userInfoArr, function(o) { return o.userId == profile.userId })) {
			userInfoArr.push(new UserInfo(profile.userId,[],false))
		}
		switch (event.message.type) {
			case 'text':
				if (_.startsWith(event.message.text,'-a')) {
					let stockIdArrBySplit = event.message.text.replace('-a','').trim().split("-")
					let userInfo = _.find(userInfoArr, function(o) { return o.userId === profile.userId })
					
					let responseSuccessId = [];
					_.forEach(stockIdArrBySplit , function(stockId) { 
						if (stockId.length == 4) {
							if (!_.includes(userInfo.stockIdArr, stockId)) {
								userInfo.subscr = true
								userInfo.stockIdArr.push(stockId)
								addToStockList(stockId)
								responseSuccessId.push(stockId)
							}
						}
					})
					if (responseSuccessId.length > 0) {
						event.reply('您好' + profile.displayName + '，已成功開啟推播\n股票代號:' + responseSuccessId.join(','))
					}

				} else if (_.startsWith(event.message.text,'-r')) {
					let userInfo = _.find(userInfoArr, function(o) { return o.userId === profile.userId; })
					let stockIdArrBySplit = event.message.text.replace('-r','').trim().split("-")
						_.forEach(stockIdArrBySplit , function(stockIdneedDel) { 
							_.forEach(userInfo.stockIdArr, function(stockIdown) {
								_.remove(userInfo.stockIdArr, function(n) {return stockIdneedDel == stockIdown})
							})
						})
					event.reply('您好' + profile.displayName + "，股票代號:" +stockIdArrBySplit.join(',') + '，已移除推播清單')
				} else if (_.startsWith(event.message.text,'-i')) {
					let stockIdArrBySplit = event.message.text.replace('-i','').trim().split("-")
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

				} else if (_.startsWith(event.message.text,'-s') || _.startsWith(event.message.text,'-c')) {
					let type = event.message.text.trim();
					let userInfo = _.find(userInfoArr, function(o) { return o.userId === profile.userId; })
					if (type == "-s") {
						userInfo.subscr = true
						event.reply('您好' + profile.displayName + '，已開啟推播')
					} else {
						userInfo.subscr = false
						event.reply('您好' + profile.displayName + '，已暫停推播')
					}
				} else if (_.startsWith(event.message.text,'-v')) {
					let showMessage = "";
					showMessage += "輸入-a 股票代號 可定時推播該股票資訊\n\t(例如: -a 2353-2330)\n"
					showMessage += "輸入-i 股票代號 可回應該股票資訊\n\t(例如: -c 2353-2330)\n"
					showMessage += "輸入-s 可開啟推播\n"
					showMessage += "輸入-c 可暫停推播\n"
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
let count = 1;
rp(reqOpt)
.then(function (repos) {
	setInterval(function() {
		let temp = ''
		_.forEach(stockList , function(stockVO) { 
			temp += 'tse_' + stockVO.stockId + '.tw' + '%7c'
		});
		reqOpt.uri = "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?cp=0&json=1&delay=0&_=" + Date.now() + "&ex_ch=" + temp.substring(0, temp.length - 3)
		if (stockList.length > 0) {
			rp(reqOpt)
			.then(function (repos) {
				var jsonObject = JSON.parse(repos)
				if (!!jsonObject.msgArray) {
					console.log("第" + (count++) + "次成功")
				} else {
					console.log("第" + (count++) + "次失敗")
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
	} ,60000)
})
.catch(function (err) {
	console.log("前導網頁get cookie發生錯誤:" + err)
})

	
const addToStockList = (stockId: string) => {
	if (!_.find(stockList, function(o) { return o.stockId == stockId; })) {
		stockList.push(new StockInfo(stockId, '', 0.0, 0.0, 0.0, 0.0))
	}
}

