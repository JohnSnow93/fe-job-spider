const request = require("request-promise");
const qs = require('qs');
const colors = require('colors');
const fs = require("fs");
const puppeteer = require('puppeteer');
const {sleep, getKeyWords, processSalary, processSalaryLevel, yearLevel} = require('./utils');

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
      site: '拉勾',
      companyId: job.companyId
    }
  });
}

async function fetchPosition(page = 1, first = true) {
  console.log(`开始获取第${page}页数据`.green);
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
    if(!res.content){
      console.log(res);
    }
    console.info(`成功获取第${page}页数据, 共${res.content.positionResult.result.length}条数据`.green);
    let result = [];
    try {
      result = processData(res.content.positionResult.result);
    } catch (e) {
      console.log(res);
      console.warn(e);
      result = [];
    }
    return { result, totalCount: res.content.positionResult.totalCount };
  } catch (e) {
    console.warn(`请求第${page}页发生错误，错误信息如下：`.yellow);
    console.warn(e);
    return { result: [] };
  }
}

async function start() {
  console.log("开始获取拉钩网数据".blue);
  let maxPageCount = 1;
  let currentPage = 1;
  let result = [];
  const browser = await puppeteer.launch({
    // headless: false
  });
  const page = await browser.newPage();
  page.on('response', async (res)=>{
    const url = await res.url();
    if(url.includes('positionAjax.json')){
      try {
        let resBody = await res.json();
        let jobData = processData(resBody.content.positionResult.result);
        result = result.concat(jobData);
        if(currentPage === 1){
          maxPageCount = await page.$$eval('.pager_not_current', arr => {
            console.log(arr.length);
            return arr[arr.length - 1].innerText;
          });
          maxPageCount = parseInt(maxPageCount || 1);
        }
        if(currentPage <= maxPageCount){ // 没有超过页数，点击下一页
          const next = await page.$('.pager_is_current + .pager_not_current');
          console.log(currentPage);
          if(next){
            await page.click('.pager_is_current + .pager_not_current')
          }
        }
        currentPage +=1;
        if(currentPage > maxPageCount){
          saveFile(result);
          // await browser.close();
        }
      } catch (e) {
        console.warn(e);
      }
    }
  });
  await page.goto('https://www.lagou.com/jobs/list_前端?city=成都&cl=false&fromSearch=true&labelWords=&suginput=');




  // console.info('请求结束'.blue);
  //

}

function saveFile(result){
  fs.writeFile(__dirname + '/result/lagouResult.js', 'module.exports = ' + JSON.stringify(result), (e) => {
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
