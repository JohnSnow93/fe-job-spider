const puppeteer = require("puppeteer");
const fs = require('fs');

const $_INDEX_INPUT = '#wrap > div.column-search-panel > div > div > div.search-form > form > div.search-form-con > p > input';
const $_INDEX_SEARCH_BTN = '#wrap > div.column-search-panel > div > div > div.search-form > form > button';


async function run() {
  const browser = await puppeteer.launch({
    // headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://www.zhipin.com');
  await page.type($_INDEX_INPUT,'前端');


  await Promise.all([
    page.waitForNavigation(),
    page.click($_INDEX_SEARCH_BTN)
  ]);

  let index = 1;
  let urls = [];

  for (let i = 1; i <= 10; i++) {
    let result = await page.$$('.job-primary>.info-primary h3 > a');
    if(result && result.length > 0){
      let url = await page.url();
      let urlObj = new URL(url);
      let currentPage = ~~(urlObj.searchParams.get('page'));
      let activePageAElement = await page.$('.page > .cur');
      let nextPageAElement = await page.$('.page > .cur + a');
      let activePage = ~~(activePageAElement.text || '');
      let nextPage = ~~(nextPageAElement.text || '');
      if(currentPage === activePage) {
        // url页码和页面中的当前页码相等，说明没有超出页码范围


        if(nextPage){
          // 点击下一页
          await Promise.all([
            page.waitForNavigation(),
            page.click('.page > .cur + a')
          ]);
        }
      } else {
        break;
      }
    }
    let currentPageUrls = Array.from(result || []).map((a) => {
      return a.href;
    });
    urls = urls.concat(currentPageUrls);
  }


  console.log(urls.length);


}

run();
