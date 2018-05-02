import * as line from '@line/bot-sdk'
import express from 'express'
import _ from 'lodash'
import { returnFloat } from './util'
import { UserInfo, StockInfo } from './model'

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
  switch (event.type) {
    case 'message':
      switch (event.message.type) {
        case 'text':
          return handleText(event.message.text, event.replyToken, event.source)
        default:
          return replyText(event.replyToken, '請輸入正確訊息唷')
      }
    case 'postback':
      return handlePostback(event.postback.data, event.replyToken, event.source)
    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`)
  }
}

const handleText = (message, replyToken, source) => {
  const buttonsImageURL = 'https://cfshopeetw-a.akamaihd.net/file/3685534c240f2f87221dac2be92e7f84_tn'
  let userName = ''
  client.getProfile(source.userId)
        .then((profile) => { userName = profile.displayName })

  if (!userInfoArr.find((o) => { return o.userId === source.userId })) {
    let userInfo = new UserInfo()
    userInfo.userId = source.userId
    userInfoArr.push(userInfo)
  }

  switch (message) {
    case 'carousel':
      return client.replyMessage(
        replyToken, {

        })
    default:
      return replyText(replyToken, message.text)
  }
}

const replyText = (token, message) => {
  return client.replyMessage(
    token, 
    { type: 'text', message }
  )
}

const handlePostback = (data, replyToken, source) => {
  let userName = ''
  client.getProfile(source.userId)
        .then((profile) => { userName = profile.displayName })
  switch (data) {
    default:
      return replyText(replyToken, `${userName}傳入參數success:${data}\n`)
  }
}

const addToStockList = (stockId: string) => {
	if (!stockList.find((o) => { return o.stockId === stockId })) {
		let stockInfo = new StockInfo()
		stockInfo.stockId = stockId
		stockList.push(stockInfo)
	}
}
