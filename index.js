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

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
