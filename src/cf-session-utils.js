const r2 = require('r2');
const confUtils = require('./conf-utils');
const moment = require('moment');

const GOOGLEAPI_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';
const GOOGLEAPI_VALUES_LOCATION = '/values/Sheet1!B3:D12';
const GOOGLEAPI_KEY_PARAM = 'key';

const WEEKDAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const buildRequestUrl = function (apiKey, sheetID) {
    let url = GOOGLEAPI_BASE_URL;
    url += sheetID;
    url += GOOGLEAPI_VALUES_LOCATION;
    url += '?' + GOOGLEAPI_KEY_PARAM + '=' + apiKey
    return url;
};

var today = moment();
console.log('today is ' + today.format('dddd'));
let threeDaysForward = WEEKDAYS[(WEEKDAYS.indexOf(today.format('dddd')) + 3) % 7];

async function getUserSessions(apiKey, user) {
    let reqUrl = buildRequestUrl(apiKey, user.gsheetId);
    let response;
    try {
        response = await r2(reqUrl).json;
    } catch (error) {
        console.log("error");
        return;
    }
    console.log('attempting to book sessions for ' + threeDaysForward);
    return response.values.filter(cfSession => cfSession[0].toLowerCase() === threeDaysForward);
}

moment.locale('fr');

module.exports = {
    getBookableSessions: function () {
        const conf = confUtils.readConfFile();
        let sessionsPerUserList = [];
        const apiKey = conf.key;
        conf.users.forEach(user => {
            let cfSessionList = getUserSessions(apiKey, user);
            sessionsPerUserList.push({ user, cfSessionList });
        });

        return sessionsPerUserList;
    }
}


