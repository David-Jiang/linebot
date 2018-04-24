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

const userInfo = {
	userId: '',
	stockIdArr: []
};

let userInfoArr = [];

bot.on('message', function (event) {
	let userName = '';
	let id = '';
	/* event.source.profile().then(function (profile) {
		if (!_.find(userInfoArr, function(o) { return o.userId == profile.userId; })) {
			userInfo.userId = profile.userId;
			userInfoArr.push(userInfo);
		}
		userName = profile.displayName;
		id = profile.userId;
	}); */
	switch (event.message.type) {
		case 'text':
			if (_.startsWith(event.message.text,'-a')) {
				let stockId = event.message.text.replace('-a','').trim();
				let index = _.findIndex(userInfo, function(o) { return o.userId === id; });
				let temp = _.clone(userInfo[index].stockIdArr);
				if (stockId.length == 4 && !_.includes(temp, stockId)) {
					temp.push(stockId);
				}
				userInfo[index].stockIdArr = temp;
			} else {
				event.reply('您好，' + userName + '能否為您效勞？');
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
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;

	}
});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});

setInterval(function() {
	_.forEach(userInfoArr, function(vo) {
		bot.push(vo.userId, {
			type: 'text',
			text: '你訂閱股票代號為：' + _.join(vo.stockIdArr, ',')
		});
	});
} ,10000);