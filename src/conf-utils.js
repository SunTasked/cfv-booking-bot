const fs = require('fs');

module.exports = {
    readConfFile : function() {
        let rawdata = fs.readFileSync('./data/config.json');  
        return JSON.parse(rawdata);
    }
}