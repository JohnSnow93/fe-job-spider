const request = require("request-promise");
const qs = require('qs');
const colors = require('colors');
const fs = require("fs");
const {sleep, getKeyWords, processSalary, processSalaryLevel, yearLevel} = require('./utils');

let cookies = '';
let publicHeaders = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36",
    "Referer": "https://www.lagou.com/jobs/list_%E5%89%8D%E7%AB%AF?labelWords=&fromSearch=true&suginput=",
    "Content-Type": "application/x-www-form-urlencoded;charset = UTF-8"
};

function formatJobYear(str){
    let result = yearLevel['不限'];
    switch (str) {
        case '应届毕业生' : result = yearLevel["1年以下"]; break;
        case '1年以内' : result = yearLevel["1年以下"]; break;
        case '1-3年' : result = yearLevel["1-3年"]; break;
        case '3-5年' : result = yearLevel["3-5年"]; break;
        case '5-10年' : result = yearLevel["5-10年"]; break;
        case '10年以上' : result = yearLevel["10年以上"]; break;
    }
    return result;
}

function processData(jobDataArray = []){
    return jobDataArray.map((job) => {
        let salary = processSalary(job.salary)
        return {
            district: job.district,
            education: job.education,
            companyStaffAmount: job.companySize,
            companyFinancialStatus: job.financeStage,
            salary,
            salaryLevel: processSalaryLevel(salary),
            keywords: job.positionLables || [],
            year: formatJobYear(job.workYear),
            site: '拉勾'
        }
    });
}

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
        let result = [];
        try {
            result = processData(res.content.positionResult.result);
        } catch (e) {
            console.warn(e)
            result = [];
        }
        return [];
    } catch (e) {
        console.warn(`请求第${page}页发生错误，错误信息如下：`);
        console.warn(e);
        return [];
    }
}

async function start() {
    console.log("开始获取拉钩网数据".blue);
    let page = 1;
    let first = true;
    let res = [];
    cookies = await getPageSessionCookie();
    while (page <= 30 && !(res instanceof Error)){
        let result = await fetchPosition(page, first);
        if(result.length < 15) break;
        res = res.concat(result);
        page ++;
        first = false
    }
    console.info('请求结束'.blue);

    fs.writeFile(__dirname + '/result/lagouResult.js', 'module.exports = ' + JSON.stringify(res), (e) => {
        if(!e){
            console.log('成功写入文件'.bgGreen);
        } else {
            console.log('写入出错'.bgYellow);
            console.log(e);
        }
    });
}

start()

module.exports = start;
