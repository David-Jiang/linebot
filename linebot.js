import * as line from '@line/bot-sdk'
import express from 'express'
/* import { returnFloat } from './util'
import { UserInfo, StockInfo } from './model' */

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
}

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

const client = new line.Client(config)

const handleEvent = (event: any) => {
  switch (event.type) {
    case 'message':
      switch (event.message.type) {
        case 'text':
          return handleText(event.message, event.replyToken, event.source)
        default:
          throw new Error(`Unknown message: ${JSON.stringify(event.message)}`)
      }
    case 'postback':
      () => {
        const data = event.postback.data
        let message = ''
        /* if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
          message += `(${JSON.stringify(event.postback.params)})`
        } */
        message += `(${JSON.stringify(event.postback.params)})`
        return replyText(event.replyToken, `Got postback: ${message}`)
      }
      break
    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`)
  }
}

const handleText = (message, replyToken, source) => {
  const buttonsImageURL = 'https://cfshopeetw-a.akamaihd.net/file/3685534c240f2f87221dac2be92e7f84_tn'

  switch (message.text) {
    case 'profile':
      if (source.userId) {
        return client.getProfile(source.userId)
          .then((profile) => {
            replyText(replyToken, [
              `Display name: ${profile.displayName}`,
              `Status message: ${profile.statusMessage}`,
            ])
        })
      } else {
        return replyText(replyToken, 'Bot can\'t use profile API without user ID')
      }
    case 'buttons':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Buttons alt text',
          template: {
            type: 'buttons',
            thumbnailImageUrl: buttonsImageURL,
            title: 'My button sample',
            text: 'Hello, my button',
            actions: [
              { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
              { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
              { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
              { label: 'Say message', type: 'message', text: 'Rice=米' },
            ],
          },
        }
      )
    case 'confirm':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Confirm alt text',
          template: {
            type: 'confirm',
            text: 'Do it?',
            actions: [
              { label: 'Yes', type: 'message', text: 'Yes!' },
              { label: 'No', type: 'message', text: 'No!' },
            ],
          },
        }
      )
    case 'carousel':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Carousel alt text',
          template: {
            type: 'carousel',
            columns: [
              {
                thumbnailImageUrl: buttonsImageURL,
                title: 'hoge',
                text: 'fuga',
                actions: [
                  { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                  { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                ],
              },
              {
                thumbnailImageUrl: buttonsImageURL,
                title: 'hoge',
                text: 'fuga',
                actions: [
                  { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                  { label: 'Say message', type: 'message', text: 'Rice=米' },
                ],
              },
            ],
          },
        }
      )
    case 'image carousel':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Image carousel alt text',
          template: {
            type: 'image_carousel',
            columns: [
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
              },
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
              },
              {
                imageUrl: buttonsImageURL,
                action: { label: 'Say message', type: 'message', text: 'Rice=米' },
              },
              {
                imageUrl: buttonsImageURL,
                action: {
                  label: 'datetime',
                  type: 'datetimepicker',
                  data: 'DATETIME',
                  mode: 'datetime',
                },
              },
            ]
          },
        }
      )
    case 'datetime':
      return client.replyMessage(
        replyToken,
        {
          type: 'template',
          altText: 'Datetime pickers alt text',
          template: {
            type: 'buttons',
            text: 'Select date / time !',
            actions: [
              { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
              { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
              { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
            ],
          },
        }
      )
    default:
      return replyText(replyToken, message.text)
  }
}

const replyText = (token, texts) => {
  let message = Array.isArray(texts) ? texts : [texts]
  return client.replyMessage(
    token,
    message.map((text: string) => ({ type: 'text', text }))
  )
}
