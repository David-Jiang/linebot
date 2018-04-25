const linebot = require('linebot');
const express = require('express');
const rp = require('request-promise');
const _ = require('lodash');

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

const linebotParser = bot.parser();

app.post('/linewebhook', linebotParser);

const userInfo = {
	userId: '',
	stockIdArr: [],
	subscr: false
};
let userInfoArr = [];

const stockInfo = {
	stockId: '',
	startPrice: 0.0,
	currPrice: 0.0,
	lowPrice: 0.0,
	hightPrice: 0.0
};
let stockList = [];
var copy = Object.assign({}, stockInfo);
copy.stockId = "2082"
console.log("origin" + stockInfo)
console.log("current" + copy)

bot.on('message', function (event) {
	event.source.profile().then(function (profile) {
		if (!_.find(userInfoArr, function(o) { return o.userId == profile.userId; })) {
			userInfo.userId = profile.userId;
			userInfoArr.push(userInfo);
		}
		switch (event.message.type) {
			case 'text':
				if (_.startsWith(event.message.text,'-a')) {
					let stockId = event.message.text.replace('-a','').trim();
					let index = _.findIndex(userInfoArr, function(o) { return o.userId === profile.userId; });
					let temp = userInfoArr[index].stockIdArr;
					
					if (stockId.length == 4) {
						if (_.includes(temp, stockId)) {
							event.reply('您好' + profile.displayName + '，股票代號:' + stockId + "已經存在推播清單囉");
						} else {
							userInfoArr[index].subscr = true;
							if (!_.find(stockList, function(o) { return o.stockId == stockId; })) {
								stockInfo.stockId = stockId;
								stockList.push(stockInfo);
							}
							event.reply('您好' + profile.displayName + '，已成功開啟推播股票代號:' + stockId);
							temp.push(stockId);
						}
					} else {
						event.reply('您好' + profile.displayName + '，請輸入正確股票代號格式唷');
					}
				} else if (_.startsWith(event.message.text,'-r')) {
					let userInfo = _.find(userInfoArr, function(o) { return o.userId === profile.userId; });
					userInfo.subscr = false;
					event.reply('您好' + profile.displayName + '，已取消推播');
				} else {
					event.reply('您好' + profile.displayName + '，能否為您效勞？');
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
				event.reply('請輸入正確訊息唷');
				break;
	
		}
	});
});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});

setInterval(function() {
	_.forEach(userInfoArr, function(vo) {
		if (vo.subscr && vo.stockIdArr.length > 0) {
			let showMessage = '';
			_.forEach(vo.stockIdArr , function(stockId) {
				let obj = _.find(stockList, function(o) { return o.stockId == stockId && o.currPrice > 0; });
				if (obj) {
					showMessage += "股票代號:" + obj.stockId + "\n目前股價:" + obj.currPrice + "(" + 
						(obj.currPrice - obj.startPrice > 0 ? "+" : "") + (obj.currPrice - obj.startPrice) + ")\n" +
						"最高價:" + obj.hightPrice + "\n最高價:" + obj.lowPrice
				}
			});

			if (showMessage) {
				bot.push(vo.userId, {
					type: 'text',
					text: showMessage
				});
			}
		}
	});
} ,60000);


const jar = rp.jar();
const reqOpt = {
	uri: "http://mis.twse.com.tw/stock/fibest.jsp?lang=zh_tw",
	jar,
  headers:
  	{
    	'content-type': 'application/json'
    }
};
rp(reqOpt)
	.then(function (repos) {
		setInterval(function() {
			let temp = '';
			_.forEach(stockList , function(stockVO) { 
  			temp += 'tse_' + stockVO.stockId + '.tw' + '%7c';
			});
			reqOpt.uri = "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?_=" + Date.now() + "&ex_ch=" + temp.substring(0, temp.length - 3);
			if (stockList.length > 0) {
				rp(reqOpt)
				.then(function (repos) {
					var jsonObject = JSON.parse(repos);
		
					_.forEach(jsonObject.msgArray , function(vo) { 
						let info = _.find(stockList, function(o) { return o.stockId == vo.ch.replace(".tw",""); })
						info.startPrice = vo.y;
						info.lowPrice = vo.l;
						info.hightPrice = vo.h;
						info.currPrice = vo.z;
					});
				})
				.catch(function (err) {
					console.log("getStockInfo發生錯誤:" + err);
				});
			}
		} ,20000);
	})
	.catch(function (err) {
		console.log("前導網頁get cookie發生錯誤:" + err);
	});

