const axios = require('axios');
const cfSessionUtils = require('./src/cf-session-utils');


let headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'members.pushpress.com',
    'Referer': 'https://members.pushpress.com/login/auth',
    'Origin': 'https://members.pushpress.com',
    'X-Requested-With': 'XMLHttpRequest'
}

const buildAuthBody = function(user)
{
    let body = "username=" + user.username;
    body += "&client_id=" + user.pushpressId;
    body += "&password=" + user.password;
    return body;
}

async function bookSessions(userConf) {
    console.log(buildAuthBody(userConf.user));
    let res = await axios.post('https://members.pushpress.com/login/auth', buildAuthBody(userConf.user), { headers, withCredentials: true });
    let headers2 = {
        Cookie: res.headers['set-cookie'][0]
    };
    let res2 = await axios.get('https://cfv.members.pushpress.com/schedule/index/179/2019/', { headers: headers2 });
    console.log(res2.status);
}

async function run() {
    let bookingList = await cfSessionUtils.getBookableSessions();
    bookingList.forEach(userConf => {
        console.log(userConf.user);
        console.log(userConf.cfSessionList);
        bookSessions(userConf)
    });
}

run();
