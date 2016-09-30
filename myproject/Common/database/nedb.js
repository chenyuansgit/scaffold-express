var Datastore = require('nedb');
var nedbConfig = require('../../Config/nedbConfig.js');

console.log(nedbConfig.dataFilePath);
var modeDb = new Datastore({filename: nedbConfig.dataFilePath, autoload: true});


module.exports = modeDb;