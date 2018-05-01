import * as line from '@line/bot-sdk'
import express from 'express'
/* import rp from 'request-promise'
import _ from 'lodash'
import { returnFloat } from './util'
import { UserInfo, StockInfo } from './model' */

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
}

const app = express()
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => { console.log(res.json(result)) })
})

const client = new line.Client(config)
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text,
  })
}

app.listen(process.env.PORT || 80, () => {
	console.log('LineBot is running.')
})
