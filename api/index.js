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

let boss_list = {
  "0": {
    name: '上司1',
    start_datetime: null,
    register: [
      {id: 1, name: "部下１"}, {id: 2, name: "部下2"}, {id: 3, name: "部下3"}
    ],
    push_list: {}
  },
  "1": {
    name: '上司２',
    start_datetime: null,
    register: [],
    push_list: {}
  }
}


/**
 * 上司の情報を取得
 */
function get_boss(id, res) {
  return new Promise((resolve, reject) => {
    const boss = boss_list[id];
    if (boss === undefined) {
      reject({message: 'Boss Not Found', error: {boss_list: boss_list}});
      return;
    }
    resolve(boss);
  })
  .catch( (e) => {
    if (res != undefined) {
      error_response(res, e.message, e.error);
    }
    return e;
  });
}

/**
 * エラー応答
 */
function error_response(res, message, error) {
  if (message === undefined) {
    message = '';
  }

  if (error === undefined) {
    error = {};
  }

  res.statusCode = 400;
  res.json({
    message: message,
    error: error
  });
}

function success_response(res, data) {
  res.statusCode = 200;
  res.json({data: data});
}

/**
 * ボス情報の新規登録
 */
router.post('/boss', (req, res, next) => {
  const boss = {
    name: req.body.name,
    register: [],
    push_list: {}
  }
  if (req.body.id === undefined) {
    error_response(res, 'body.id is required', {body: body});
    return;
  }
  boss_list[req.body.id] = boss;
  success_response(res, boss_list);
})

/**
 * ボス情報の一覧取得
 */
router.get('/boss', (req, res, next) => {
  success_response(res, boss_list);
})

/**
 * ボス情報の更新
 */
router.post('/boss/:id', (req, res, next) => {
  get_boss(req.params.id, res)
    .then( (boss) => {
      boss['name'] = req.body.name;
      boss['start_datetime'] = req.body.start_datetime;
      success_response(res, boss);
    });
})

/**
 * ボス情報の詳細取得
 */
router.get('/boss/:id', (req, res, next) => {
  get_boss(req.params.id, res)
    .then( (boss) => {
      success_response(res, boss);
    });
})

/**
 * 部下が上司の待ち登録
 */
router.post('/boss/:id/regist', (req, res, next) => {
  get_boss(req.params.id, res)
    .then( (boss) => {
      if (req.body.name === undefined) {
        error_response(res, 'body.name is required', req.body);
        return;
      }
      boss.register.push({name: req.body.name});
      success_response(res, boss.register);
    })
})

/**
 * 待ち人数を取得する
 */
router.get('/boss/:id/regist', (req, res, next) => {
  get_boss(req.params.id, res)
    .then( (boss) => {
      success_response(res, boss.register);
    })
})

/**
 * 待ちから抜ける
 */
router.post('/boss/:id/unregist', (req, res, next) => {
  error_response(res);
})


/**
 * 早押し開始
 */
router.post('/boss/:id/start', (req, res, next) => {
  const boss_id = req.params.id;
  get_boss(boss_id, res)
    .then( (boss) => {
      const start_sec = 10; // 何秒後に開始するかの指定
      const count_sec = 10; // カウントダウン時間
      const result_sec = 5; // 結果通知時間

      // 開始時刻
      let start_date = new Date()
      date.setSeconds(date.getSeconds() + start_sec)

      boss.push_list = {};
      boss.register = [];

      // カウントダウン開始時刻の通知
      console.log('count down: notice');
      ds.send({type: 'notice', id: boss_id, datetime: start_date})

      // カウントダウン開始の通知
      setTimeout(() => {
        console.log('count down: start');
        ds.send({type: 'start', id: boss_id, datetime: start_date})
      }, start_sec * 1000);

      // カウントダウン終了の通知
      setTimeout(() => {
        console.log('count down: finish');
        ds.send({type: 'finish', id: boss_id, datetime: start_date})
      }, (start_sec + count_sec) * 1000);

      // 結果の通知
      setTimeout(() => {
        console.log('count down: result');
        get_boss(boss_id)
          .then( (boss) => {
            ds.send({type: 'result', id: boss_id, datetime: start_date, result: boss.push_list});
          })
      }, (start_sec + count_sec + result_sec) * 1000);

      success_response(res, date);
    })
})

/**
 * 早押しボタンを押した
 *
 * body.id : 上司のID
 */
router.post('/boss/:id/push', (req, res, next) => {
  // TODO: Kintoneにデータを登録する
  get_boss(req.params.id, res)
    .then( (boss) => {
      if (req.body.name === undefined) {
        error_response(res, 'body.name is required', req.body);
        return;
      }
      const name = req.body.name;
      if (!(name in boss.push_list)) {
        const datetime = new Date();
        boss.push_list[name] = datetime;
      }
      success_response(res, boss.push_list);
    })
    .catch( (e) => {
      error_response(res, e.message, e.error);
    })
})


module.exports = router
