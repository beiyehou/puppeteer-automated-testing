const fs = require('fs');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone6 = devices['iPhone 6'];
const baiduAccount = require("./config/baidu.json");
const chromiumConfig = require("./config/chromium.json");

let launchOptions = {
    headless: false,
    slowMo: 500
};

if (chromiumConfig.executablePath) {
    launchOptions.executablePath = chromiumConfig.executablePath;
}

//executablePath:'./chrome-mac/Chromium.app/Contents/MacOS/Chromium'

/** Testing the screenshots folder and create it if not existing. **/
try {
    fs.accessSync("./screenshots", fs.constants.F_OK);
} catch(err) {
    fs.mkdirSync("./screenshots");
}


puppeteer.launch(launchOptions).then(async browser => {
    const page = await browser.newPage();
    await page.emulate(iPhone6);
    /** Load baidu homepage. **/
    await page.goto('https://www.baidu.com');
    /** Click user icon and redirect to login page. **/
    await page.waitForSelector('#header #login');
    await page.screenshot({path: './screenshots/homepage.png', type:'png'});
    const $loginEle = await page.$('#header #login');
    if ($loginEle) {
        await $loginEle.click();
    }
    /** Click login button. **/
    await page.waitForSelector("#page-bd .user-login a");
    await page.screenshot({path: './screenshots/settingpage.png', type:'png'});
    const $loginBtn = await page.$("#page-bd .user-login a");
    if ($loginBtn) {
        await $loginBtn.click();
    }
    /** Now login with password and username **/
    await page.waitForSelector("#login-formWrapper");
    await page.screenshot({path: './screenshots/loginpage.png', type:'png'});
    const $loginForm = await page.$("#login-formWrapper");
    const $userNameInput = await $loginForm.$("#login-username");
    const $passwordInput = await $loginForm.$("#login-password");
    await $userNameInput.type(baiduAccount.username, {delay: 300});
    await $passwordInput.type(baiduAccount.password, {delay: 300});
    const $submitBtn = await $loginForm.$("#login-submit");
    await $submitBtn.click();
    /** Login finished. **/
    await page.screenshot({path: './screenshots/loginfinished.png', type:'png'});
    browser.close();
});