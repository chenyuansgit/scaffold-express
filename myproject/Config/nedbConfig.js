var path = require('path');

var nedbConfig = {
    dataFilePath: path.join(__dirname, '../', 'nedbFiles', 'modeConfigDB.db')
};

module.exports = nedbConfig;