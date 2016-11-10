const Kintone = require('./kintone');

class Boss extends Kintone {
  constructor(subdomain, token) {
    super(subdomain, 4, token);
  }

  normalize(record) {
    super.normalize(record);
    return {
      id:             record['record_number'].value,
      code:           record['user'].value[0].code,
      name:           record['user'].value[0].name,
      push_id:        record['push_id'].value,
      organization:   record['organization_select'].value[0].name,
      register:       record['register'].value,
      start_datetime: record['start_datetime'].value,
      icon:           record['icon'].value
    }
  }

  create(code, organization_code) {
    const body = {
      app: this.getAppId(),
      record: {
         organization_select: {
           value: [
             {code: organization_code}
           ]
         },
         user: {
           value: [
             {code: code}
           ]
         }
      }
    }
    return super.create(body)
      .then((result) => {
        return result.id;
      })
      .then((id) => {
        return super.read(id);
      })
  }

  clearRegist(boss_id) {
    const body = {
      app: this.getAppId(),
      id: boss_id,
      record: {
        register: {
          value: []
        }
      }
    }
    return super.update(body)
      .then((boss) => {
        // 更新された上司データから待ち人情報を返す
        return boss['register']
      })
  }

  /**
   * 待ち人の追加
   */
  regist(boss_id, subordinate_code) {
    // 既存のデータを読み出す
    return super.read(boss_id)
      .then((data) => {
        const register = (data.register === undefined) ? [] : data.register;

        // 読み出したデータに追加する
        register.push({code: subordinate_code});
        const body = {
          app: this.getAppId(),
          id: boss_id,
          record: {
            register: {
              value: register
            }
          }
        }    
        return super.update(body)
      })
      .then((boss) => {
        // 更新された上司データから待ち人情報を返す
        return boss['register']
      })
  }

  unregist(boss_id, subordinate_code) {
    return super.read(boss_id)
      .then((data) => {
        const _register = (data.register === undefined) ? [] : data.register;
        const register = _register.filter((item) => {return item.code != subordinate_code})
        const body = {
          app: this.getAppId(),
          id: boss_id,
          record: {
            register: {
              value: register
            }
          }
        }    
        return super.update(body)
      })
      .then((boss) => {
        // 更新された上司データから待ち人情報を返す
        return boss['register']
      })
  }

  updateStartDatetime(boss_id, datetime) {
    const body = {
      app: this.getAppId(),
      id: boss_id,
      record: {
        start_datetime: {
          value: datetime
        }
      }
    }
    return super.update(body);
  }

  updatePushId(boss_id, push_id) {
    const body = {
      app: this.getAppId(),
      id: boss_id,
      record: {
        push_id: {
          value: push_id 
        }
      }
    }
    return super.update(body);
  }

}

module.exports = Boss;