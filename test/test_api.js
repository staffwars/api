/**
 * Web APIのテスト
 */
const request = require('supertest');
const assert = require('assert');
const app = require('../app');

describe('Web API', () => {
  describe('/api/subordinate/', () => {
    const api = '/api/subordinate/';
    it('get', (done) => {
      request(app)
        .get(api)
        .expect((res) => {
          const data = res.body['data'];
          assert.equal(3, data.length);
        })
        .expect(200, done);
    });
    it('post')
    /*
    it('post', (done) => {
      request(app)
        .post(api)
        .expect(200, done);
    });
    */
  });

  describe('/api/subordinate/:id', () => {
    const api = '/api/subordinate/2/';
    it('get 存在するID', (done) => {
      request(app)
        .get(api)
        .expect((res) => {
          const data = res.body['data'];
          assert.equal('2', data.id);
          assert.equal('iwata-na', data.code);
          assert.equal('イワンコフ', data.name);
        })
        .expect(200, done);
    });

    it('get 存在しないID', (done) => {
      request(app)
        .get('/api/subordinate/1')
        .expect(400, done);
    })

    it('post')
  });

  describe('/api/boss/', () => {
    const api = '/api/boss/'
    it('get', (done) => {
      request(app)
        .get(api)
        .expect((res) => {
          const boss_list = res.body['data'];
          assert.equal(2, boss_list.length);
          assert.equal('1', boss_list[1].id);
          assert.equal('ショコ・マ・ツムー', boss_list[1].name);
          assert.equal('0', boss_list[1].push_id);
          assert.equal('2', boss_list[0].id);
          assert.equal('セキメイ', boss_list[0].name);
          assert.equal('0', boss_list[0].push_id);
        })
        .expect(200, done);
    })

    /*
    it('post', (done) => {
      const body = {
        name: 'iwata-na',
        organization: 'z14'
      }
      request(app)
        .post(api)
        .send(body)
        .expect((res) => {
          const data = res.body['data'];
          assert.equal('ショコ・マ・ツムー', boss_list[1].name);
          assert.equal('0', boss_list[1].push_id);
        })
        .expect(200, done);
    })
    */
  })

  describe('/api/boss/:id', () => {
    const api = '/api/boss/1';
    it('get 存在するID', (done) => {
      request(app)
        .get(api)
        .expect((res) => {
          const body = res.body;
          const data = body['data'];
          assert.equal('1', data.id);
          assert.equal('ショコ・マ・ツムー', data.name);
        })
        .expect(200, done);
    })
    
    it('get 存在しないID', (done) => {
      request(app)
        .get('/api/boss/0')
        .expect(400, done);
    })

    it('post')
  })

/*
  describe('/api/boss/:id/start', () => {
    const api = '/api/boss/1/start';
    it('post', (done) => {
      const body = {
        name: 'iwata-na',
        organization: 'z14'
      }
      request(app)
        .post(api)
        .send(body)
        .expect(200, done);
    })
  })
*/

  describe('/api/boss/:id/regist', () => {
    it('post', (done) => {
      const body = {

      }
      request(app)
        .post('/api/boss/2/regist')
        .send(body)
        .expect(200, done);
    })
  })
})