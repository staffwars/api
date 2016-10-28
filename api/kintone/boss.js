const Kintone = require('./kintone');

class Boss extends Kintone {
  constructor(subdomain, token) {
    super(subdomain, 4, token);
  }

  normalize(record) {
    super.normalize();
    return {
      id:   record['record_number'].value,
      code: record['user'].value[0].code,
      name: record['user'].value[0].name,
      push_id: record['push_id'].value,
      organization: record['organization_select'].value[0].name,
      register: record['register'].value
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
    return super._put('record.json', body)
      .then((result) => {
        // 更新されたデータを取得する
        return super.read(boss_id)
      })
      .then((boss) => {
        // 更新された上司データから待ち人情報を返す
        return boss['register']
      })
  }

  regist(boss_id, subordinate_code) {
    return super.read(boss_id)
      .then((data) => {
        const register = (data.register === undefined) ? [] : data.register;
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
        return super._put('record.json', body);
      })
      .then((result) => {
        // 更新されたデータを取得する
        return super.read(boss_id)
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
        return super._put('record.json', body);
      })
      .then((result) => {
        // 更新されたデータを取得する
        return super.read(boss_id)
      })
      .then((boss) => {
        // 更新された上司データから待ち人情報を返す
        return boss['register']
      })
  }

}

module.exports = Boss;