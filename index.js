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
					if (stockId.length == 4 && !_.includes(temp, stockId)) {
						temp.push(stockId);
					}
					userInfoArr[index].subscr = true;
					event.reply('您好' + profile.displayName + '，已開啟推撥成功');
					if (!_.find(stockList, function(o) { return o.stockId == stockId; })) {
						stockInfo.stockId = stockId;
						stockList.push(stockInfo);
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
				showMessage += JSON.stringify(_.find(stockList, function(o) { return o.stockId == stockId; }));
			});
			bot.push(vo.userId, {
				type: 'text',
				text: '你訂閱股票代號為：' + showMessage
			});
		}
	});
} ,10000);


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
			rp(reqOpt)
			.then(function (repos) {
				var jsonObject = JSON.parse(repos);
		
				_.forEach(jsonObject.msgArray , function(vo) { 
					_.forEach(stockList , function(stockVO) { 
							if (vo.ch.replace(".tw","") == stockVO.stockId) {
								stockList.startPrice = vo.y;
								stockList.lowPrice = vo.l;
								stockList.hightPrice = vo.h;
								stockList.currPrice = vo.pz;
								return false;
							}
					});
				});
				console.log(stockList)
			})
			.catch(function (err) {
				console.log("getStockInfo發生錯誤:" + err);
			});
		} ,30000);
	})
	.catch(function (err) {
		console.log("前導網頁get cookie發生錯誤:" + err);
	});

