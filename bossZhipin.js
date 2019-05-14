const puppeteer = require("puppeteer");
const { URL } = require("url");
const fs = require('fs');
const {getDistrict, getKeyWords, processSalary} = require('./chengduDistrict');

function generateUrl(page = 1){
  return `https://www.zhipin.com/c101270100/?query=前端&page=${page}&;ka=page-${page}`;
}

async function fetchUrls(browser) {

  const page = await browser.newPage();

  let urls = [];

  for (let i = 1; i <= 10; i++) {
    if(i === 1){
      await page.goto(generateUrl(i));
    }

    let result = await page.$$eval('.job-primary>.info-primary h3 > a', linkElArray => { return linkElArray.map(i => i.href) });
    if(result && result.length > 0){
      let url = await page.url();
      let urlObj = new URL(url);
      let currentPage = ~~(urlObj.searchParams.get('page'));
      let activePage = await page.$eval('.page > .cur', el => el.text);
      let nextPage = await page.$eval('.page > .cur + a', el => el.text);
      if(currentPage === parseInt(activePage)) {
        // url页码和页面中的当前页码相等，说明没有超出页码范围
        urls = urls.concat(result);
        if(nextPage){
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

  return urls;
}

async function fetchDetail(url, browser){
  const page = await browser.newPage();
  await page.goto(url);
  let jobDescription = await page.$eval('.job-sec', el => el.innerText);
  let keywords = getKeyWords(jobDescription);
  let salary = await page.$eval('.salary', el => el.innerText);
  salary = processSalary(salary)
  let infoArr = await page.$eval('.job-primary > .info-primary > p', el => el.innerHTML.split('<em class="dolt"></em>'));
  let year = infoArr[1];
  let education = infoArr[2];
  let location = await page.$eval('.location-address', el => el.innerText);
  let district = await getDistrict(location);
  let companyStaffAmount = await page.$eval('.sider-company > p:nth-child(4)', el => el.innerText);
  let companyFinancialStatus = await page.$eval('.sider-company > p:nth-child(3)', el => el.innerText);

  await page.close();

  return { district, salary, keywords, companyFinancialStatus, companyStaffAmount, year, education};
}

async function run(){
  const browser = await puppeteer.launch({
    // headless: false
  });
  // let detailList = [];
  // const urls = (await fetchUrls(browser)) || [];
  // for (let i = 0; i < url.length; i++) {
  //   detailList.push(await fetchDetail(urls[i], browser));
  // }
  const a = await fetchDetail('https://www.zhipin.com/job_detail/8561a178b69694561XN829S0E1Y~.html', browser);
  console.log(a)
}

run();
