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
    console.log(result)
    let currentPageUrls = Array.from(result || []).map((a) => {
      return a.href;
    });
    urls = urls.concat(currentPageUrls);
  }


  console.log(urls.length);


}

run();
