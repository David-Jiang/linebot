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

bot.on('message', function (event) {
	switch (event.message.type) {
		case 'text':
			event.reply("165156");
			break;
		case 'sticker':
			event.reply({
				type: 'sticker',
				packageId: 1,
				stickerId: 1
			});
			break;
	default:
			event.reply('Unknow message: ' + JSON.stringify(event));
			break;

	}
	/* event.reply(event.message.text)
	.then(function (data) {
		console.log('Success', data);
	}).catch(function (error) {
		console.log('Error', error);
	}); */
});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});