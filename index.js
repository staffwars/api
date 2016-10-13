/**
 * Web APIサーバ
 */
console.log('start web api');
const express = require('express');
const app = express();
const http = require('http').Server(app)

// リクエストのBodyをパースするためのライブラリを追加
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ルーティング
console.log('setup routing');
const api = require('./api/')
app.use('/api', api)

console.log('load MilkCocoa libirary');
// MilkCocoa
const MilkCocoa = require('milkcocoa');
const milkcocoa = new MilkCocoa('guitariu6e7lgx.mlkcca.com');
const ds = milkcocoa.dataStore('message');

ds.on('send', function() {
  console.log('sendされました！');
});

// サーバの起動
app.listen(process.env.port, () => {
  console.log('Example app listening on port 3000!');
});
