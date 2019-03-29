const r2 = require('r2');
const confUtils = require('./conf-utils');

const GOOGLEAPI_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';
const GOOGLEAPI_VALUES_LOCATION = '/values/Sheet1!B3:D12';
const GOOGLEAPI_KEY_PARAM = 'key';

const buildRequestUrl = function (apiKey, sheetID) {
    let result = GOOGLEAPI_BASE_URL;
    result += sheetID;
    result += GOOGLEAPI_VALUES_LOCATION;
    result += '?' + GOOGLEAPI_KEY_PARAM + '=' + apiKey
    return result;
};

const conf = confUtils.readConfFile();

conf.users.forEach(async user => {
    let reqUrl = buildRequestUrl(conf.key, user.gsheetId);
    try {
        let response = await r2(reqUrl).json;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
});


