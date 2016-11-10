const Kintone = require('./kintone');

class Push extends Kintone {
  constructor(subdomain, token) {
    super(subdomain, 3, token);
  }

  normalize(record) {
    super.normalize(record);
    return {
      id: record['record_number'].value,
      datetime: record['datetime'].value,
      boss: record['boss'].value[0],
      subordinate: record['subordinate'].value[0],
      push_id: record['push_id'].value
    }
  }

  list(boss_code, push_id) {
    if (boss_code == undefined) {
      return super.list()
    }
    const query = 'boss in ("' + boss_code + '") and push_id=' + push_id;
    return super.list(query)
      .then((result) => {
        let subordinate_list = []
        return result.reverse().filter((item) => {
          // リストに存在しなければ追加する
          const f = subordinate_list.indexOf(item.subordinate.code) < 0
          subordinate_list.push(item.subordinate.code)
          return f
        })
      })
      // 互換性の為に反転する
      .then((result) => {return result.reverse()})
  }

  create(boss_code, subordinate_code, push_id, datetime) {
    if (datetime === undefined) {
      datetime = Date.now();
    }
    const body = {
      app: this.getAppId(),
      record: {
        boss: {
          value: [
            {
              code: boss_code
            }
          ]
        },
        subordinate: {
          value: [
            {
              code: subordinate_code
            }
          ]
        },
        push_id: {
          value: push_id
        },
        datetime: {
          value: datetime
        }
      }
    }
    return super.create(body)
  }

}

module.exports = Push;
