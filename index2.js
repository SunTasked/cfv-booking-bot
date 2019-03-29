const axios = require('axios');
const moment = require('moment');


let headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Host': 'members.pushpress.com',
    'Referer': 'https://members.pushpress.com/login/auth',
    'Origin': 'https://members.pushpress.com',
    //'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
}

let body = "username=guillaume.kheng%40gmail.com&client_id=???&password=???";

console.log(moment().dayOfYear())

async function run() {
    let res = await axios.post('https://members.pushpress.com/login/auth', body, { headers, withCredentials : true });
    //console.log(res.headers['set-cookie'][0]);
    let headers2 = {
        Cookie: res.headers['set-cookie'][0]
    };

    let res2 = await axios.get('https://cfv.members.pushpress.com/schedule/index/108/2019/', { headers : headers2 });
    console.log(res2.data);
}

run();