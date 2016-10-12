/**
 * Web APIの実装部分
 */
const express = require('express')
const request = require('request')

const router = express.Router()

// MilkCocoa
const MilkCocoa = require('milkcocoa');
const milkcocoa = new MilkCocoa('guitariu6e7lgx.mlkcca.com');
const ds = milkcocoa.dataStore('messages');

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
 * ボス情報の新規登録
 *
 * id
 * name
 */
router.post('/boss', (req, res, next) => {
})

/**
 * ボス情報の一覧取得
 */
router.get('/boss', (req, res, next) => {
})

/**
 * ボス情報の更新
 */
router.post('/boss/:id', (req, res, next) => {
})

/**
 * ボス情報の詳細取得
 */
router.get('/boss/:id', (req, res, next) => {
})

/**
 * 部下が上司の待ち登録
 */
router.post('/boss/:id/regist', (req, res, next) => {
})

/**
 * 待ち人数を取得する
 */
router.get('/boss/:id/regist', (req, res, next) => {
})


/**
 * 早押し開始
 */
router.post('/boss/:id/start', (req, res, next) => {
  console.log('/boss/:id/start');
  let date = new Date()
  date.setSeconds(date.getSeconds() + 10)

  ds.send({datetime: date})
  res.json(create_response(OK, '開始', {datetime: date}))
})

/**
 * 早押しボタンを押した
 *
 * body.id : 上司のID
 */
router.post('/subordinate/push', (req, res, next) => {
  // TODO: Kintoneにデータを登録する
  res.json(create_response(OK, '', {id: req.body.name} ));
})


module.exports = router
