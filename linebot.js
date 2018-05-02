import * as line from '@line/bot-sdk'
import express from 'express'
import _ from 'lodash'
import { returnFloat } from './util'
import { UserInfo, StockInfo, CarouselTemplate, CarouselModel } from './model'

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
}
const client = new line.Client(config)

const app = express()
app.listen(process.env.PORT || 80, () => {
  console.log('LineBot is running')
})
app.post('/linewebhook', line.middleware(config), (req, res) => {
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end()
  }

  Promise
    .all(req.body.events.map(handleEvent))
    .then(() => { res.end() })
    .catch((err) => {
      console.error(`處理事件發生error, reason is : ${err}`)
      res.status(500).end()
    })
})

let userInfoArr = []
let stockList = []

const handleEvent = (event: any) => {
  console.log(event.type)
  switch (event.type) {
    case 'message':
      switch (event.message.type) {
        case 'text':
          return handleText(event.message.text, event.replyToken, event.source)
        default:
          return replyText(event.replyToken, '請輸入正確訊息唷')
      }
    case 'postback':
      return handlePostback(event.postback, event.replyToken, event.source)
    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`)
  }
}

const handleText = (text: string, replyToken: any, source: any) => {
  let messageText = text

  let userName = ''
  client.getProfile(source.userId)
        .then((profile) => { userName = profile.displayName })

  if (!userInfoArr.find((o) => { return o.userId === source.userId })) {
    let userInfo = new UserInfo()
    userInfo.userId = source.userId
    userInfoArr.push(userInfo)
  }

  if (messageText.startsWith('-a')) {
    let stockIdArrBySplit = messageText.replace('-a', '').trim().split('-')
    let userInfo = userInfoArr.find((o) => { return o.userId === source.userId })
    let responseSuccessId = []

    stockIdArrBySplit.forEach((stockId) => { 
      if (stockId.length === 4 && !userInfo.stockIdArr.includes(stockId)) {
        userInfo.subscr = true
        userInfo.stockIdArr.push(stockId)
        addToStockList(stockId)
        responseSuccessId.push(stockId)
      }
    })
    if (responseSuccessId.length > 0) {
      replyText(replyToken, `您好${userName}，已成功開啟推播\n股票代號:${responseSuccessId.join(',')}`)
    }
  } else if (messageText.startsWith('-r')) {
    let stockIdArrBySplit = messageText.replace('-r', '').trim().split('-')
    let userInfo = userInfoArr.find((o) => { return o.userId === source.userId })

    stockIdArrBySplit.forEach((stockIdneedDel) => { 
      _.remove(userInfo.stockIdArr, (stockIdown) => { return stockIdneedDel === stockIdown })
    })
    replyText(replyToken, `您好${userName}，股票代號:${stockIdArrBySplit.join(',')}，已移除推播清單`)
  } else if (messageText.startsWith('-i')) {
    let stockIdArrBySplit = messageText.replace('-i', '').trim().split('-')
    let showMessage = ''

    stockIdArrBySplit.forEach((stockId) => { 
      if (stockId.length === 4) {
        addToStockList(stockId)
        let obj = stockList.find((o) => { return o.stockId === stockId && o.currPrice > 0 })
        if (obj) {
          showMessage += `股票${obj.stockName}(${obj.stockId})\n
目前價:${obj.currPrice}(${(obj.currPrice - obj.startPrice > 0 ? '+' : '')} ${returnFloat(obj.currPrice - obj.startPrice)} )\n
最高價:${obj.hightPrice}\n
最低價:${obj.lowPrice}\n`
        }
      }
    })
    
    if (!!showMessage) {
      replyText(replyToken, showMessage)
    }
  } else if (messageText.startsWith('-s') || messageText.startsWith('-c')) {
    let type = messageText.trim()
    let userInfo = userInfoArr.find((o) => { return o.userId === source.userId })
    if (type === '-s') {
      userInfo.subscr = true
      replyText(replyToken, `您好${userName}，已開啟推播`)
    } else {
      userInfo.subscr = false
      replyText(replyToken, `您好${userName}，已暫停推播`)
    }
  } else if (messageText.startsWith('-v')) {
    let showMessage = '輸入-a 股票代號 可定時推播該股票資訊\n\t(例如: -a 2353-2330)\n'
    showMessage += '輸入-i 股票代號 可回應該股票資訊\n\t(例如: -c 2353-2330)\n'
    showMessage += '輸入-s 可開啟推播\n'
    showMessage += '輸入-c 可暫停推播\n'
    showMessage += '輸入-r 股票代號 可移除該股票資訊推播\n\t(例如: -r 2353-2330)\n'
    replyText(replyToken, showMessage)
  } else if (messageText === 'kiwi') {
    replyTemplate(replyToken)
  } else {
    replyText(replyToken, `您好${userName}，歡迎使用\n輸入-v 可以查看功能列表`)
  }
}

const handlePostback = (postback: any, replyToken: any, source: any) => {
  let userName = ''
  client.getProfile(source.userId)
        .then((profile) => { userName = profile.displayName })
  switch (postback.data) {
    case 'DATE':  
      return replyText(replyToken, `${userName}傳入參數success:${JSON.stringify(postback.params)}\n`)
    default:
      return replyText(replyToken, `${userName}傳入參數success:${postback.data}\n`)
  }
}

const replyText = (token: any, message: string) => {
  return client.replyMessage(
    token, 
    { type: 'text', message }
  )
}

const replyTemplate = (token: any) => {
  let carouselArr = CarouselTemplate.template.columns
  let carouselModel = Object.assign({}, CarouselModel)

  carouselModel.thumbnailImageUrl = 'https://www.taiwan.net.tw/att/1/big_scenic_spots/pic_290_7.jpg'
  carouselModel.title = '九份老街'
  carouselModel.text = '邊喝茶邊看夕陽好去處'
  carouselModel.actions.push({ label: '介紹連結', type: 'uri', uri: 'https://www.taiwan.net.tw/m1.aspx?sNo=0001091&id=290' })
  carouselModel.actions.push({ label: '我想去這邊', type: 'postback', data: '九份' })
  carouselModel.actions.push({ label: '點選出遊時間', type: 'datetimepicker', data: 'DATE', mode: 'date' })
  carouselArr.push(carouselModel)

  carouselModel = Object.assign({}, CarouselModel)
  carouselModel.thumbnailImageUrl = 'https://www.taiwan.net.tw/att/1/big_scenic_spots/pic_19_10.jpg'
  carouselModel.title = '淡水老街'
  carouselModel.text = '邊遊玩邊看夕陽好去處'
  carouselModel.actions.push({ label: '介紹連結', type: 'uri', uri: 'https://www.taiwan.net.tw/m1.aspx?sNo=0001016&id=19' })
  carouselModel.actions.push({ label: '我想去這邊', type: 'postback', data: '淡水' })
  carouselModel.actions.push({ label: '點選出遊時間', type: 'datetimepicker', data: 'DATE', mode: 'date' })
  carouselArr.push(carouselModel)

  return client.replyMessage(
    token, 
    CarouselTemplate
  )
}

const addToStockList = (stockId: string) => {
	if (!stockList.find((o) => { return o.stockId === stockId })) {
		let stockInfo = new StockInfo()
		stockInfo.stockId = stockId
		stockList.push(stockInfo)
	}
}
