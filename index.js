const linebot = require('linebot');
const express = require('express');
const _ = require('lodash');

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

const linebotParser = bot.parser();

app.post('/linewebhook', linebotParser);

const aqiOpt = {
	uri: "https://tw.stock.yahoo.com/q/q?s=2337"
};
app.get('/',function(req,res){
	rp(aqiOpt)
	.then(function (repos) {
			console.log(repos)
	})
	.catch(function (err) {
			res.send("無法取得空氣品質資料～");
	});
});


const userInfo = {
	userId: '',
	stockIdArr: [],
	subscr: false
};

let userInfoArr = [];

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
			bot.push(vo.userId, {
				type: 'text',
				text: '你訂閱股票代號為：' + _.join(vo.stockIdArr, ',')
			});
		}
	});
} ,10000);