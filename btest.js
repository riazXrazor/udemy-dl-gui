const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);
  await page.goto('https://www.udemy.com/join/login-popup');

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    // page.on('response', msg => console.log('PAGE LOG:', msg.text()));
    var cookie = await page.evaluate(() => document.cookie.split(';'));
        await browser.close();
        console.log(cookie);


})();