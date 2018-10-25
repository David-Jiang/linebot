import * as line from '@line/bot-sdk';
import express from 'express';
import rp from 'request-promise';
import _ from 'lodash';
import { UserInfo, CarouselTemplate, CarouselModel } from './src/model/LineBotModel';
const path = require('path');
const bodyParser = require('body-parser');

const config = {
  channelAccessToken: 'NgamlfgqtFtz/wpiz0zQQyVhM2gwtSB3HK7UYxXppJat+353tD9j7YZ/JRe64UW3PgLfnOoxm4LDJ5pbJRmrPlJUCllejaWDH24hAhZ+Okv0aKD1c/QwjNf24KKzJKzpIcBkN8kQEQJdGLrj570ibQdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'e2dd514a9ba6200e517fb9d12ad3c0a3',
};
const administerIdArr = ['Ude5b0ad0a50f55c0e74d0de95f9800d1', 'Ucb4720559edda7096b1cc0ff0f842ce6'];

const client = new line.Client(config);
const app = express();
const server = app.listen(process.env.PORT, () => {
  console.log(`LineBot is running port : ${server.address().port}`);
});
/* app.use(express.static(__dirname + '/'));
app.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
}); */
app.use(bodyParser.text({ type: 'text/plain' }));
app.post('/test', (req, res) => {
  const { message, type } = JSON.parse(req.body);
  administerIdArr.forEach((administerId) => {
    pushText(administerId, `有一則${type}新留言，來自${message}，詢問為何我這麼智障`);
  });
  res.end();
});
app.post('/linewebhook', line.middleware(config), (req, res) => {
  if (!Array.isArray(req.body.events)) {
    res.status(500).end();
  }

  Promise
    .all(req.body.events.map(handleEvent))
    .then(() => { res.end(); })
    .catch((err) => {
      console.error(`處理事件發生error, reason is :${err}`);
      res.status(500).end();
    });
});

const handleEvent = (event: any) => {
  switch (event.type) {
    case 'message':
      switch (event.message.type) {
        case 'text':
          return handleText(event.message.text, event.replyToken, event.source);
        default:
          return replyText(event.replyToken, '不好意思，請輸入訊息唷');
      }
    case 'postback':
      return handlePostback(event.postback, event.replyToken, event.source);
    default:
      throw new Error(`handleEvent error : ${JSON.stringify(event)}`);
  }
};

const handleText = (text, replyToken, source) => {
  let messageText = text;
  client.getProfile(source.userId)
    .then((profile) => { return profile.displayName; })
    .then((userName) => {
      //let userInfo = new UserInfo()

      if (messageText === 'poa') {
        console.log(`${userName} userId is ${source.userId}`)
        replyText(replyToken, `成功綁定Line Bot ID -> ${source.userId}`);
      } else if (messageText === 'image') {
        replyTemplate(replyToken);
      } else {
        replyText(replyToken, `您好${userName}`);
      }
    });

};

const handlePostback = (postback: any, replyToken: any, source: any) => {
  client.getProfile(source.userId)
    .then((profile) => { return profile.displayName; })
    .then((userName) => {
      switch (postback.data) {
        case 'DATE':
          return replyText(replyToken, `${userName}表示有空的時間是：${postback.params.date}`);
        default:
          return replyText(replyToken, `${userName}表示想去${postback.data}玩`);
      }
    });
};

const pushText = (userId, message) => {
  return client.pushMessage(
    userId, { type: 'text', text: message }
  );
}

const replyText = (token, message) => {
  return client.replyMessage(
    token, { type: 'text', text: message }
  );
};

const replyTemplate = (token: any) => {
  let carouselTemplate = new CarouselTemplate();
  let carouselArr = carouselTemplate.template.columns;
  let carouselModel = null;

  carouselModel = new CarouselModel();
  carouselModel.thumbnailImageUrl = 'https://www.taiwan.net.tw/att/1/big_scenic_spots/pic_290_7.jpg';
  carouselModel.title = '九份老街';
  carouselModel.text = '邊喝茶邊看夕陽好去處';
  carouselModel.actions.push({ label: '介紹連結', type: 'uri', uri: 'https://www.taiwan.net.tw/m1.aspx?sNo=0001091&id=290' });
  carouselModel.actions.push({ label: '我想去這邊', type: 'postback', data: '九份' });
  carouselModel.actions.push({ label: '點選出遊時間', type: 'datetimepicker', data: 'DATE', mode: 'date' });
  carouselArr.push(carouselModel);

  carouselModel = new CarouselModel();
  carouselModel.thumbnailImageUrl = 'https://pic.pimg.tw/eeooa0314/1381924583-3686791643.jpg';
  carouselModel.title = '松山文創園區';
  carouselModel.text = '文藝復興夜景生活';
  carouselModel.actions.push({ label: '介紹連結', type: 'uri', uri: 'http://eeooa0314.pixnet.net/blog/post/274880483-%E3%80%90%E5%8F%B0%E5%8C%97%E3%80%91%E5%8F%B0%E5%8C%97%E9%80%9B%E8%A1%97%2C%E6%95%A3%E6%AD%A5%E5%A5%BD%E5%8E%BB%E8%99%95%E2%99%A5%E6%9D%BE%E5%B1%B1%E6%96%87%E5%89%B5%E5%9C%92' });
  carouselModel.actions.push({ label: '我想去這邊', type: 'postback', data: '松山文創' });
  carouselModel.actions.push({ label: '點選出遊時間', type: 'datetimepicker', data: 'DATE', mode: 'date' });
  carouselArr.push(carouselModel);

  carouselModel = new CarouselModel();
  carouselModel.thumbnailImageUrl = 'https://www.taiwan.net.tw/att/1/big_scenic_spots/pic_19_10.jpg';
  carouselModel.title = '淡水老街';
  carouselModel.text = '邊遊玩邊看夕陽好去處';
  carouselModel.actions.push({ label: '介紹連結', type: 'uri', uri: 'https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=19' });
  carouselModel.actions.push({ label: '我想去這邊', type: 'postback', data: '淡水' });
  carouselModel.actions.push({ label: '點選出遊時間', type: 'datetimepicker', data: 'DATE', mode: 'date' });
  carouselArr.push(carouselModel);

  return client.replyMessage(
    token, carouselTemplate
  );
};

/* const reqOpt = {
  uri: '',
  headers: {
    'content-type': 'application/json',
  }
};
rp(reqOpt)
  .then((repost) => {
  })
  .catch((err) => {
    console.log(`ajax發生錯誤:${err}`);
  }); */