/**
 * Kintoneのラッパー
 */

const request = require('request')

/**
 * KintoneのAPIラッパークラス
 */
class Kintone {
  
  /**
   * コンストラクタ
   */
  constructor(subdomain, app_id, token) {
    this.subdomain = subdomain;
    this.app_id = app_id;
    this.token = token;
  }

  /****************************************************************************
   * Abstract method
   ***************************************************************************/
  /**
   * データの正規化
   * 
   * Kintone上のデータを使いやすい形に変換する
   */
  normalize(record) {
     return {}
  }

  /****************************************************************************
   * Private method
   ***************************************************************************/
  /**
   * リクエスト
   */
  _request(method, api, params, contentType) {
    return new Promise((resolve, reject) => {
      //ヘッダーを定義
      var headers = {
        'Content-Type': contentType,
        'X-Cybozu-API-Token': this.token
      }

      //オプションを定義
      var options = {
        url: 'https://' + this.subdomain + '.cybozu.com/k/v1/' + api,
        method: method,
        headers: headers,
        json: true,
        body: params
      }

      //リクエスト送信
      request(options, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        if (response.statusCode == 500) {
          return reject(response.statusMessage);
        }
        resolve(body);
      })
    })

  }

  _post(api, params) {
    return this._request('POST', api, params, 'application/json')
  }
  
  _put(api, params) {
    return this._request('PUT', api, params, 'application/json')
  }

  _get(api, params) {
    return this._request('GET', api, params)
  }

  _delete(api, params) {
    return this._request('DELETE', api, params)
  }


  /****************************************************************************
   * Public method
   ***************************************************************************/
  getAppId() {
    return this.app_id;
  }

  /**
   * 一覧の取得
   */
  list(query) {
    if (query === undefined) {
      query = ''
    }
    return this._get('records.json?app=' + this.app_id + '&query=' + query + '&totalCount=true')
      .then((result) => {
        return result['records'].map((item) => {return this.normalize(item)})
      })
  }

  /**
   * データの追加
   */
  create(body) {
    return this._post('record.json', body)
      .then((result) => {
        return this.read(result['id'])
      })
  }

  /**
   * データの取得
   */
  read(id) {
    return this._get('record.json?app=' + this.app_id + '&id=' + id)
      .then((result) => {
        return this.normalize(result['record']);
      })
  }

  /**
   * データの削除
   */
  delete(id) {
    return this._delete('records.json?app=' + this.app_id + '&ids[0]=' + id)
  }
}

module.exports = Kintone;