const _defaults = require('lodash.defaults')
const async = require('async')
const bunyan = require('bunyan')
const levelup = require('levelup')
const tv = require('term-vector')

module.exports = function (givenOptions, callback) {
  var docGetter = {}
  getOptions(givenOptions, function (err, options) {
    docGetter.getDoc = function (docID, callback) {
      options.indexes.get('DOCUMENT￮' + docID + '￮', function (err, value) {
        if (err) {
          return callback(err, null)
        } else {
          return callback(null, value)
        }
      })
    }
    return callback(err, docGetter)
  })
}

var getOptions = function (givenOptions, callbacky) {
  givenOptions = givenOptions || {}
  async.parallel([
    function (callback) {
      var defaultOps = {}
      defaultOps.deletable = true
      defaultOps.fieldedSearch = true
      defaultOps.fieldsToStore = 'all'
      defaultOps.indexPath = 'si'
      defaultOps.logLevel = 'error'
      defaultOps.nGramLength = 1
      defaultOps.separator = /[\|' \.,\-|(\n)]+/
      defaultOps.stopwords = tv.getStopwords('en').sort()
      defaultOps.log = bunyan.createLogger({
        name: 'search-index',
        level: givenOptions.logLevel || defaultOps.logLevel
      })
      callback(null, defaultOps)
    },
    function (callback) {
      if (!givenOptions.indexes) {
        levelup(givenOptions.indexPath || 'si', {
          valueEncoding: 'json'
        }, function (err, db) {
          callback(err, db)
        })
      } else {
        callback(null, null)
      }
    }
  ], function (err, results) {
    var options = _defaults(givenOptions, results[0])
    if (results[1] != null) {
      options.indexes = results[1]
    }
    return callbacky(err, options)
  })
}
