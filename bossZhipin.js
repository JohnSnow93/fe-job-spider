const puppeteer = require("puppeteer");
const {URL} = require("url");
const fs = require('fs');
const colors = require('colors');
const {getDistrict, getKeyWords, processSalary, processSalaryLevel} = require('./chengduDistrict');

function generateUrl(page = 1) {
  return `https://www.zhipin.com/c101270100/?query=前端&page=${page}&;ka=page-${page}`;
}

async function fetchUrls(browser) {

  console.log('开始批量获取URL'.green);
  const page = await browser.newPage();

  let urls = [];

  for (let i = 1; i <= 10; i++) {
    if (i === 1) {
      await page.goto(generateUrl(i));
    }

    let result = await page.$$eval('.job-primary>.info-primary h3 > a', linkElArray => {
      return linkElArray.map(i => i.href)
    });
    if (result && result.length > 0) {
      let url = await page.url();
      let urlObj = new URL(url);
      let currentPage = ~~(urlObj.searchParams.get('page'));
      let activePage = await page.$eval('.page > .cur', el => el.text);
      let nextPage = await page.$eval('.page > .cur + a', el => el.text);
      if (currentPage === parseInt(activePage)) {
        // url页码和页面中的当前页码相等，说明没有超出页码范围
        urls = urls.concat(result);
        if (nextPage) {
          // 点击下一页
          await Promise.all([
            page.waitForNavigation(),
            page.click('.page > .cur + a')
          ]);
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }

  await page.close();
  console.log(`获取URL完成, 共${urls.length}条`.bgGreen);
  return urls;
}

async function fetchDetail(url, browser) {
  const page = await browser.newPage();
  await page.goto(url);
  let jobDescription = await page.$eval('.job-sec', el => el.innerText);
  let keywords = getKeyWords(jobDescription);
  let salary = await page.$eval('.salary', el => el.innerText);
  salary = processSalary(salary);
  let salaryLevel = processSalaryLevel(salary);
  let infoArr = await page.$eval('.job-primary > .info-primary > p', el => el.innerHTML.split('<em class="dolt"></em>'));
  let year = infoArr[1];
  let education = infoArr[2];
  let location = await page.$eval('.location-address', el => el.innerText);
  let district = await getDistrict(location);
  let companyStaffAmount = await page.$eval('.sider-company > p:nth-child(4)', el => el.innerText);
  let companyFinancialStatus = await page.$eval('.sider-company > p:nth-child(3)', el => el.innerText);

  await page.close();

  return {district, salary, salaryLevel, keywords, companyFinancialStatus, companyStaffAmount, year, education};
}

async function run() {
  const browser = await puppeteer.launch({
    // headless: false
  });
  let detailList = [];
  const urls = (await fetchUrls(browser)) || [];
  console.log('开始获取详情'.blue);
  for (let i = 0; i < urls.length; i++) {
    try {
      detailList.push(await fetchDetail(urls[i], browser));
    } catch (e) {
      console.log(`获取详情时发生错误：${urls[i]}`.yellow);
    }
  }

  fs.writeFile(__dirname + '/client/result.json', JSON.stringify(detailList), (e) => {
    if(!e){
      console.log('成功写入文件'.bgGreen);
    } else {
      console.log('写入出错'.bgYellow);
      console.log(e);
    }
  });

  await browser.close();
}

run();
