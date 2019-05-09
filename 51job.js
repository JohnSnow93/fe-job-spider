const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  await page.goto('https://www.51job.com');
  await page.click('#kwdselectid');
  await page.type('#kwdselectid','前端');
  await page.click('body > div.content > div > div.fltr.radius_5 > div > button');

  browser.close();
}

run();
