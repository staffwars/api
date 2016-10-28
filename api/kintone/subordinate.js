const Kintone = require('./kintone');

class Subordinate extends Kintone {
  constructor(subdomain, token) {
    super(subdomain, 1, token);
  }

  normalize(record) {
      return {
          id:   record['record_number'].value,
          code: record['user'].value[0].code,
          name: record['user'].value[0].name,
          organization: record['organization_select'].value[0].name
      }
  }

  create(code) {
    const body = {
      app: this.getAppId(),
      record: {
      }
    }

    return super.create(body)
  }
}

module.exports = Subordinate;