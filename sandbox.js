// kintoneアクセス
const subordinate_token = 'itBK7sYl4QkqnE8PQJAo61pt6Pnt7ZulXyPrMNcl';
const boss_token = '5rh0Y90ofFV2PQOurGhUKwywjvxBdFlvy6wzHOs5';
const push_token = 'CGCVf4Q8bdsiJLo8euYZTo8FEKOAsa3vT9mb72xC';

const kintone = require('./api/kintone');
const subordinate = new kintone.Subordinate('1m675', subordinate_token);
const boss = new kintone.Boss('1m675', boss_token);
const push = new kintone.Push('1m675', push_token);


boss.list()
  .then((users) => {
    console.log(users)
  })
  .catch((error) => {
    console.error(error);
  });

/*
push.list()
    .then((recodes) => {
        console.log(recodes)
    });
*/