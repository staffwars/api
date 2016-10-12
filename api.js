/**
 * Web APIの実装部分
 */
const express = require('express')
const request = require('request')

const router = express.Router()

const OK = 'ok';
const NG = 'ng';

/**
 * レスポンスメッセージの作成
 */
function create_response(result, message, data) {
  return {
    result: result,
    message: message,
    data: data
  }
}

/**
 * 早押し開始
 */
router.post('/start', (req, res, next) => {
  let date = new Date()
  date.setSeconds(date.getSeconds() + 10)
  res.json(create_response(OK, '開始', {datetime: date}))
})

/**
 * 早押しボタンを押した
 */
router.post('/push', (req, res, next) => {
  // TODO: Kintoneにデータを登録する
  res.json(create_response(OK, '', {id: req.body.name} ));
})

module.exports = router
