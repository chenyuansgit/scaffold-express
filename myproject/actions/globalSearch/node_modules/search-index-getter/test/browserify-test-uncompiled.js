const levelup = require('levelup')
const sia = require('search-index-adder')
const sig = require('../')

var batch = require('../node_modules/reuters-21578-json/data/justTen/justTen.json')
levelup('test/sandbox/simpleIndexing', {
  valueEncoding: 'json',
  db: require('level-js')
}, function (err, db) {
  if (err) console.log(err)
  sia({indexes: db}, function (err, indexer) { // causes woe in browsers
    if (err) console.log(err)
    indexer.add(batch, {}, function (err) {
      if (err) console.log(err)
      sig({indexes: db}, function (err, getter) {
        if (err) console.log(err)
        getter.getDoc('4', function (err, doc) {
          if (err) console.log(err)
          document.getElementById('result').innerHTML = doc.title
          console.log(doc)
        })
      })
    })
  })
})
