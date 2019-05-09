const request = require("request-promise");
const qs = require('qs');
const colors = require('colors');
const fs = require("fs");

let cookies = '';
let publicHeaders = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36",
    "Referer": "https://www.lagou.com/jobs/list_%E5%89%8D%E7%AB%AF?labelWords=&fromSearch=true&suginput=",
    "Content-Type": "application/x-www-form-urlencoded;charset = UTF-8"
};

async function getPageSessionCookie(){
    const res = await request.get("https://www.lagou.com/jobs/list_%E5%89%8D%E7%AB%AF?labelWords=&fromSearch=true&suginput=", {
        resolveWithFullResponse: true,
        headers: {
            ...publicHeaders
        }
    });

    return res.headers['set-cookie'];
}

async function fetchPosition(page = 1, first = true) {
    console.log('开始获取', page);
    try {
        const res = await request.post("https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false", {
            // resolveWithFullResponse: true,
            headers: {
                'Cookie': cookies,
                ...publicHeaders,
            },
            json: true,
            body: qs.stringify({
                first,
                pn: page,
                kd: '前端'
            })
        });
        console.info(`成功获取第${page}页数据, 共${res.content.positionResult.result.length}条数据`.green);
        return res.content.positionResult.result;
    } catch (e) {
        console.warn(`请求第${page}页发生错误，错误信息如下：`);
        console.warn(e);
        return e;
        return [];
    }
}

async function start() {
    console.log("开始获取拉钩网数据".blue);
    let page = 1;
    let first = true;
    let res = [];
    cookies = await getPageSessionCookie();
    while (page <= 2 && !(res instanceof Error)){
        let result = await fetchPosition(page, first);
        res = res.concat(result);
        page ++;
        first = false
    }
    console.info('请求结束'.blue);
    // try {
    //     console.log('开始写入文件'.bgBlue);
    //     fs.writeFile('data.json',JSON.stringify(res), function (err) {
    //         console.log(err)
    //     })
    // } catch (e) {
    //     console.log(e);
    // }
}

start()

module.exports = start;
