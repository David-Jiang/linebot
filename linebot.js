import * as line from '@line/bot-sdk';
import express from 'express';
import rp from 'request-promise';
import _ from 'lodash';
import { returnFloat } from './src/util/Util';
import { UserInfo, StockInfo, CarouselTemplate, CarouselModel } from './src/model/LineBotModel';

var path = require('path');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);
const app = express();
app.listen(process.env.PORT || 80, () => {
  console.log('LineBot is running and Port is ' + process.env.PORT);
});
app.use(express.static(__dirname + '/'));
app.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.post('/linewebhook', line.middleware(config), (req, res) => {
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  Promise
    .all(req.body.events.map(handleEvent))
    .then(() => { res.end(); })
    .catch((err) => {
      console.error(`處理事件發生error, reason is :${err}`);
      res.status(500).end();
    });
});

let userInfoArr = [];
let stockList = [];

const handleEvent = (event: any) => {
  switch (event.type) {
    case 'message':
      switch (event.message.type) {
        case 'text':
          return handleText(event.message.text, event.replyToken, event.source);
        default:
          return replyText(event.replyToken, '請輸入正確訊息唷');
      }
    case 'postback':
      return handlePostback(event.postback, event.replyToken, event.source);
    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
};

const handleText = (text: string, replyToken: any, source: any) => {
  let messageText = text;
  client.getProfile(source.userId)
    .then((profile) => { return profile.displayName; })
    .then((userName) => {
      if (!userInfoArr.find((o) => { return o.userId === source.userId; })) {
        let userInfo = new UserInfo();
        userInfo.userId = source.userId;
        userInfoArr.push(userInfo);
      }

      if (messageText.startsWith('-a')) {
        let stockIdArrBySplit = messageText.replace('-a', '').trim().split('-');
        let userInfo = userInfoArr.find((o) => { return o.userId === source.userId; });
        let responseSuccessId = [];

        stockIdArrBySplit.forEach((stockId) => {
          if (stockId.length === 4 && !userInfo.stockIdArr.includes(stockId)) {
            userInfo.subscr = true;
            userInfo.stockIdArr.push(stockId);
            addToStockList(stockId);
            responseSuccessId.push(stockId);
          }
        });
        if (responseSuccessId.length > 0) {
          replyText(replyToken, `您好${userName}，已成功開啟推播\n股票代號:${responseSuccessId.join(',')}`);
        }
      } else if (messageText.startsWith('-r')) {
        let stockIdArrBySplit = messageText.replace('-r', '').trim().split('-');
        let userInfo = userInfoArr.find((o) => { return o.userId === source.userId; });

        stockIdArrBySplit.forEach((stockIdneedDel) => {
          _.remove(userInfo.stockIdArr, (stockIdown) => { return stockIdneedDel === stockIdown; });
        });
        replyText(replyToken, `您好${userName}，股票代號:${stockIdArrBySplit.join(',')}，已移除推播清單`);
      } else if (messageText.startsWith('-i')) {
        let stockIdArrBySplit = messageText.replace('-i', '').trim().split('-');
        let showMessage = '';

        stockIdArrBySplit.forEach((stockId) => {
          if (stockId.length === 4) {
            addToStockList(stockId);
            let obj = stockList.find((o) => { return o.stockId === stockId && o.currPrice > 0; });
            if (obj) {
              showMessage += `股票${obj.stockName}(${obj.stockId})
目前價:${obj.currPrice}(${(obj.currPrice - obj.startPrice > 0 ? '+' : '')}${returnFloat(obj.currPrice - obj.startPrice)})
最高價:${obj.hightPrice}
最低價:${obj.lowPrice}`;
            }
          }
        });

        if (showMessage) {
          replyText(replyToken, showMessage);
        }
      } else if (messageText.startsWith('-s') || messageText.startsWith('-c')) {
        let type = messageText.trim();
        let userInfo = userInfoArr.find((o) => { return o.userId === source.userId; });
        if (type === '-s') {
          userInfo.subscr = true;
          replyText(replyToken, `您好${userName}，已開啟推播`);
        } else {
          userInfo.subscr = false;
          replyText(replyToken, `您好${userName}，已暫停推播`);
        }
      } else if (messageText.startsWith('-v')) {
        let showMessage = '輸入-a 股票代號 可定時推播該股票資訊\n\t(例如: -a 2327-2330)\n';
        showMessage += '輸入-i 股票代號 可回應該股票資訊\n\t(例如: -i 2327-2330)\n';
        showMessage += '輸入-s 可開啟推播\n';
        showMessage += '輸入-c 可暫停推播\n';
        showMessage += '輸入-r 股票代號 可移除該股票資訊推播\n\t(例如: -r 2327-2330)\n';
        replyText(replyToken, showMessage);
      } else if (messageText === 'image') {
        replyTemplate(replyToken);
      } else {
        replyText(replyToken, `您好${userName}，歡迎使用\n輸入-v 可以查看功能列表`);
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

const replyText = (token: any, message: string) => {
  return client.replyMessage(
    token,
    { type: 'text', text: message }
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
    token,
    carouselTemplate
  );
};

const addToStockList = (stockId: string) => {
  if (!stockList.find((o) => { return o.stockId === stockId; })) {
    let stockInfo = new StockInfo();
    stockInfo.stockId = stockId;
    stockList.push(stockInfo);
  }
};


const reqOpt = {
  uri: 'http://mis.twse.com.tw/stock/fibest.jsp?lang=zh_tw',
  headers: {
    'content-type': 'application/json',
  },
  jar: rp.jar()
};
rp(reqOpt)
  .then((repost) => {
    setInterval(() => {
      let temp = '';
      _.forEach(stockList, (stockVO) => {
        temp += `tse_${stockVO.stockId}.tw%7c`;
      });
      reqOpt.uri = `http://mis.twse.com.tw/stock/api/getStockInfo.jsp?cp=0&json=1&delay=0&_=${Date.now()}&ex_ch=${temp.substring(0, temp.length - 3)}`;
      if (stockList.length > 0) {
        rp(reqOpt)
          .then((repos) => {
            let jsonObject = JSON.parse(repos);
            if (jsonObject.msgArray) {
              console.log('取值成功');
            } else {
              console.log('取值失敗');
            }
            _.forEach(jsonObject.msgArray, (vo) => {
              let info = stockList.find((o) => { return o.stockId === vo.ch.replace('.tw', ''); });
              info.startPrice = vo.y;
              info.lowPrice = vo.l;
              info.hightPrice = vo.h;
              info.currPrice = vo.z;
              info.stockName = vo.n;
            });
          })
          .catch((err) => {
            console.log(`getStockInfo發生錯誤:${err}`);
          });
      }
    }, 60000);
  })
  .catch((err) => {
    console.log(`前導網頁get cookie發生錯誤:${err}`);
  });


setInterval(() => {
  userInfoArr.forEach((vo) => {
    if (vo.subscr && vo.stockIdArr.length > 0) {
      let showMessage = '';
      vo.stockIdArr.forEach((stockId) => {
        let obj = stockList.find((o) => { return o.stockId === stockId && o.currPrice > 0; });
        if (obj) {
          showMessage += `股票:${obj.stockName}(${obj.stockId})
目前價:${obj.currPrice}(${(obj.currPrice - obj.startPrice > 0 ? '+' : '')}${returnFloat(obj.currPrice - obj.startPrice)})${(obj.currPrice - obj.startPrice > 0 ? '漲' : '跌')}
最高價:${obj.hightPrice}
最低價:${obj.lowPrice}\n\n`;
        }
      });

      if (showMessage) {
        client.pushMessage(vo.userId, {
          type: 'text',
          text: showMessage,
        });
      }
    }
  });
}, 20000);

setInterval((function () {
  rp({
    uri: 'https://stock-backend.herokuapp.com/getStockInfo',
    headers: {
      'content-type': 'application/json',
    }
  })
    .then((repos) => {
      console.log(new Date());
    })
    .catch((err) => {
      console.log(`getStockInfo發生錯誤:${err}`);
    });
}), 60000);
