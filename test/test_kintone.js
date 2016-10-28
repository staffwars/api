/**
 * Kintoneのテスト
 */
const kintone = require('../api/kintone');
const assert = require('assert');

describe('Kintone', () => {
  describe('Boss', () => {
    const boss_token = '5rh0Y90ofFV2PQOurGhUKwywjvxBdFlvy6wzHOs5';
    const boss = new kintone.Boss('1m675', boss_token);

    context('list', () => {
      it('上司一覧が取得できる', () => {
        return boss.list()
          .then((records) => {
            assert.equal(2, records.length);
            assert.equal('1', records[1].id);
            assert.equal('0', records[1].push_id);
            assert.equal('ショコ・マ・ツムー', records[1].name);
            assert.equal('2', records[0].id);
            assert.equal('0', records[0].push_id);
            assert.equal('セキメイ', records[0].name);
          })
      })

      it('queryを指定', () => {
        return boss.list('record_number >= 2')
          .then((records) => {
            assert.equal(1, records.length);
            assert.equal('2', records[0].id);
            assert.equal('0', records[0].push_id);
          })
      })
    })

    context('create&delete', () => {
      it('新規追加して削除する', () => {
        return boss.create('iwata-na', 'z14')
          .then((record) => {
            // アイテムに登録したデータが入っていることを確認する
            assert.equal('イワンコフ', record.name, record)
            return record
          })
          .then((record) => {
            // 削除
            return boss.delete(record.id)
          })
          .then((result) => {
            // 削除できたかのチェック
            assert.deepEqual({}, result)
          });
      })
    })

    context('read', () => {
      it('特定IDのデータが取得できる', () => {
        return boss.read(1)
          .then((record) => {
            assert.equal('1', record.id);
            assert.equal('0', record.push_id);
            assert.equal('ショコ・マ・ツムー', record.name);
          })
      })
    })

    context('register', () => {
      beforeEach(() => {
        return boss.clearRegist(1)
      })

      it('追加', () => {
        return boss.regist(1, 'iwata-na')
          .then((result) => {
            // 追加のチェック
            assert.equal(1, result.length)
            assert.equal('iwata-na', result[0].code)
          })
          .catch((error) => {
            // サーバエラーが発生したらテストを失敗にする
            assert.fail('', error);
          })
      })

      it('複数追加', () => {
        return boss.regist(1, 'iwata-na')
          .then(() => {
            return boss.regist(1, 'kaifuku')           
          })
          .then((result) => {
            // 複数人が待ち状態になっている
            assert.equal(2, result.length)
            assert.equal('iwata-na', result[0].code)
            assert.equal('kaifuku', result[1].code)
          })
      })

      it('離脱', () => {
        return boss.regist(1, 'iwata-na')
          .then((result) => {
            // 追加のチェック
            assert.equal(1, result.length)
            assert.equal('iwata-na', result[0].code)

            return boss.unregist(1, 'iwata-na')
          })
          .then((result) => {
            // 離脱のチェック
            assert.equal(0, result.length)
          })
      })

      it('消去', () => {
        return boss.regist(1, 'iwata-na')
          .then(() => {
            // 消去の実行
            return boss.clearRegist(1)
          })
          .then((result) => {
            assert.equal('', result)
          })
      })
    })
  })


  describe('Subordinate', () => {
    const subordinate_token = 'itBK7sYl4QkqnE8PQJAo61pt6Pnt7ZulXyPrMNcl';
    const subordinate = new kintone.Subordinate('1m675', subordinate_token);

    context('list', () => {
      it('部下一覧が取得できる', () => {
        return subordinate.list()
          .then((records) => {
            assert.equal(3, records.length);
          })
      })
    })

    context('read', () => {
      it('特定IDのデータが取得できる', () => {
        return subordinate.read(2)
          .then((record) => {
            assert.equal('2', record.id);
            assert.equal('iwata-na', record.code);
            assert.equal('イワンコフ', record.name);
          })
      })

      it('IDが文字列の場合', () => {
        return subordinate.read("2")
          .then((record) => {
            assert.equal('2', record.id);
            assert.equal('iwata-na', record.code);
            assert.equal('イワンコフ', record.name);
          })
      })
    })
  })


  describe('Push', () => {
    const push_token = 'CGCVf4Q8bdsiJLo8euYZTo8FEKOAsa3vT9mb72xC';
    const push = new kintone.Push('1m675', push_token);

    context('list', () => {
      it('早押し一覧が取得できる', () => {
        return push.list()
          .then((records) => {
            assert.notEqual(0, records.length);
          })
      })

      it('指定した上司の指定した回の早押し一覧を取得する', () => {
        return push.list('matsumura-s', 1)
          .then((records) => {
            assert.equal(2, records.length);
            assert.equal('132', records[0].id);
            assert.equal('1', records[0].push_id);
            assert.equal('ショコ・マ・ツムー', records[0].boss);
            assert.equal('カイ・フク', records[0].subordinate);

            assert.equal('130', records[1].id);
            assert.equal('1', records[1].push_id);
            assert.equal('ショコ・マ・ツムー', records[1].boss);
            assert.equal('イワンコフ', records[1].subordinate);
          })
      })
    })

    context('create', () => {
      it('早押しの登録ができる', () => {
        return push.create('matsumura-s', 'iwata-na', 1)
          .then((result) => {
            assert.equal('ショコ・マ・ツムー', result['boss'])
            assert.equal('イワンコフ', result['subordinate'])
            assert.equal('1', result['push_id'])
            return push.delete(result.id)
          })
      })
    })
  }) 
})