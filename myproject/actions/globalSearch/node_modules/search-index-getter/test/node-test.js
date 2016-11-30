const levelup = require('levelup')
const sia = require('search-index-adder')
const sig = require('../')
const test = require('tape')

test('simple indexing/getting test', function (t) {
  var batch = require('../node_modules/reuters-21578-json/data/justTen/justTen.json')
  t.plan(7)
  t.equal(batch.length, 10)
  levelup('test/sandbox/simpleIndexing', {
    valueEncoding: 'json'
  }, function (err, db) {
    t.error(err)
    sia({indexes: db}, function (err, indexer) {
      t.error(err)
      indexer.add(batch, {}, function (err) {
        t.error(err)
        sig({indexes: db}, function (err, getter) {
          t.error(err)
          getter.getDoc('4', function (err, doc) {
            t.equal(doc.title, 'TALKING POINT/BANKAMERICA <BAC> EQUITY OFFER')
            t.error(err)
          })
        })
      })
    })
  })
})
