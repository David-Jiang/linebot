const linebot = require('linebot');
const express = require('express');

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

const linebotParser = bot.parser();

app.post('/linewebhook', linebotParser);

let userInfoArr = [];

bot.on('message', function (event) {
	event.source.profile().then(function (profile) {
		userInfoArr.push(profile.userId);
		return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
	});
	switch (event.message.type) {
		case 'text':
			event.reply("165156");
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

setTimeout(function() {
	bot.push(userInfoArr, {
		type: 'text',
		text: '目前股價:108'
	});
} ,10000);