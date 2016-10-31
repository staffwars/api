/**
 * Web APIの実装部分
 */
const express = require('express')
const router = express.Router()

// MilkCocoa
const MilkCocoa = require('milkcocoa');
const milkcocoa = new MilkCocoa('guitariu6e7lgx.mlkcca.com');
const ds = milkcocoa.dataStore('messages');

const kintone = require('./kintone');
const boss = new kintone.Boss('1m675', '5rh0Y90ofFV2PQOurGhUKwywjvxBdFlvy6wzHOs5');
const subordinate = new kintone.Subordinate('1m675', 'itBK7sYl4QkqnE8PQJAo61pt6Pnt7ZulXyPrMNcl');
const push = new kintone.Push('1m675', 'CGCVf4Q8bdsiJLo8euYZTo8FEKOAsa3vT9mb72xC');

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

/**
 * 成功
 */
function success_response(res, data) {
  res.statusCode = 200;
  res.json({data: data});
}

/**
 * 部下の新規登録
 */
router.post('/subordinate', (req, res, next) => {
  subordinate.create(req.body.name)
    .then((result) => {
      success_response(res, result);
    })
});

/**
 * 部下の一覧取得
 */
router.get('/subordinate', (req, res, next) => {
  subordinate.list()
    .then((records) => {
      success_response(res, records);
    })
    .catch((error) => {
      error_response(res, 'SubordinateListError', error);
    })
})

/**
 * 部下情報の更新
 */
router.post('/subordinate/:id', (req, res, next) => {
  subordinate.read(req.param.id)
    .then((record) => {
      success_response(res, record);
    })
    .catch((error) => {
      error_response(res, 'SubordinateError', error);
    })
})

/**
 * 部下情報の詳細取得
 */
router.get('/subordinate/:id', (req, res, next) => {
  subordinate.read(req.params.id)
    .then((record) => {
      success_response(res, record);
    })
    .catch((error) => {
      error_response(res, 'SubordinateError', error);
    })
})



/**
 * ボス情報の新規登録
 */
router.post('/boss', (req, res, next) => {
  boss.create(req.body.name, req.body.organization)
    .then((result) => {
      success_response(res, result);
    })
    .catch((error) => {
      error_response(res, 'BossCreateError', error);
    })
})

/**
 * ボス情報の一覧取得
 */
router.get('/boss', (req, res, next) => {
  boss.list()
    .then((data) => {
      success_response(res, data);
    })
    .catch((error) => {
      error_response(res, 'BossError', error);
    })
})

/**
 * ボス情報の更新
 */
router.post('/boss/:id', (req, res, next) => {
  error_response(res, 'NotImpl')
})

/**
 * ボス情報の詳細取得
 */
router.get('/boss/:id', (req, res, next) => {
  boss.read(req.params.id)
    .then( (boss_result) => {
      const push_id = Number(boss_result.push_id);
      push.list(boss_result.code, push_id)
        .then((push_result) => {
          boss_result['push_list'] = push_result
          success_response(res, boss_result);
        })
    })
    .catch((error) => {
      error_response(res, 'BossError', error);
    });
})

/**
 * 部下が上司の待ち登録
 */
router.post('/boss/:id/regist', (req, res, next) => {
  const subordinate_code = req.body.code;
  return boss.regist(req.params.id, subordinate_code)
    .then((result) => {
      success_response(res, result);
    })
    .catch((error) => {
      error_response(res, 'RegistError', error);
    })
})

/**
 * 待ち人数を取得する
 */
router.get('/boss/:id/regist', (req, res, next) => {
  boss.read(req.params.id)
    .then((result) => {
      success_response(res, result.register);
    })
    .catch((error) => {
      error_response(res, 'RegistError', error);
    })
})

/**
 * 待ちから抜ける
 */
router.post('/boss/:id/unregist', (req, res, next) => {
  if (req.body.code === undefined) {
    error_response(res, 'body.code is required', req.body);
    return;
  }
  const subordinate_code = req.body.code;
  boss.unregist(req.params.id, subordinate_code)
    .then((result) => {
      success_response(res, result);
    })
    .catch((e) => {
      error_response(res, 'PushError', error);
    })
})


/**
 * 早押し開始
 */
router.post('/boss/:id/start', (req, res, next) => {
  const boss_id = req.params.id;
  boss.read(boss_id)
    .then( (result) => {
      const start_sec = 10; // 何秒後に開始するかの指定
      const count_sec = 10; // カウントダウン時間
      const result_sec = 5; // 結果通知時間
      let push_id = Number(result.push_id);

      // 開始時刻
      let start_date = new Date()
      start_date.setSeconds(start_date.getSeconds() + start_sec)

      // カウントダウン開始時刻の通知
      console.log('count down: notice');
      ds.push({type: 'notice', id: boss_id, datetime: start_date})

      // カウントダウン開始５秒前の通知
      setTimeout(() => {
        console.log('count down: pre');
        ds.push({type: 'pre_start', id: boss_id, datetime: start_date})
      }, 5 * 1000);

      // カウントダウン開始の通知
      setTimeout(() => {
        console.log('count down: start');
        ds.push({type: 'start', id: boss_id, datetime: start_date})
      }, start_sec * 1000);

      // カウントダウン終了５秒前の通知
      setTimeout(() => {
        console.log('count down: pre');
        ds.push({type: 'pre_finish', id: boss_id, datetime: start_date})
      }, (start_sec + count_sec - 5) * 1000);

      // カウントダウン終了の通知
      setTimeout(() => {
        // push_idの更新
        push_id++;
        boss.updatePushId(boss_id, push_id)
          .then(() => {
            console.log('count down: finish');
            ds.push({type: 'finish', id: boss_id, datetime: start_date})
          })
      }, (start_sec + count_sec) * 1000);

      // 結果の通知
      setTimeout(() => {
        console.log('count down: result');
        push.list(result.code, push_id)
          .then((result) => {
            ds.push({
              type: 'result',
              id: boss_id,
              datetime: start_date,
              result: result
            });
          })
        // 待ち人を消す
        boss.clearRegist(boss_id);
      }, (start_sec + count_sec + result_sec) * 1000);

      success_response(res, result);
    })
    .catch(error => {
      console.log(error);
    })
})

/**
 * 早押しボタンを押した
 */
router.post('/boss/:boss_id/push', (req, res, next) => {
  if (req.body.code === undefined) {
    error_response(res, 'body.code is required', req.body);
    return;
  }

  const boss_id = req.params.boss_id;
  const subordinate_code = req.body.code;
  const datetime = Date.now();

  // Kintoneに登録
  boss.read(boss_id)
    .then((result) => {
      const boss_code = result.code;
      const push_id = result.push_id;
      return push.create(boss_code, subordinate_code, push_id, datetime)
    })
    .then((result) => {
      success_response(res, result);
    })
    .catch((e) => {
      error_response(res, 'PushError', error);
    })

})


module.exports = router
