/**
 * Web APIサーバ
 */
const app = require('./app');
console.log('start web api');

console.log('load MilkCocoa libirary');
// MilkCocoa
const MilkCocoa = require('milkcocoa');
const milkcocoa = new MilkCocoa('guitariu6e7lgx.mlkcca.com');
const ds = milkcocoa.dataStore('message');

ds.on('send', function() {
  console.log('sendされました！');
});

let port = process.env.port;
if (process.env['port'] === undefined) {
  port = 3000;
}

// サーバの起動
app.listen(port, () => {
  console.log('Example app listening on port 3000!');
});
