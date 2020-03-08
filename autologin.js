const fs = require('fs');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone6 = devices['iPhone 6'];
const baiduAccount = require("./config/baidu.json");
// const chromiumConfig = require("./config/chromium.json");

let launchOptions = {
    headless: false,
    slowMo: 500
};

// if (chromiumConfig.executablePath) {
//     launchOptions.executablePath = chromiumConfig.executablePath;
// }


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
    await page.waitForSelector('.menu-area .menu-icon-index');
    await page.screenshot({path: './screenshots/homepage.png', type:'png'});
    const $loginEle = await page.$('.menu-area .menu-icon-index');
    if ($loginEle) {
        await $loginEle.click();
    }
    /** Click login button. **/
    await page.waitForSelector("#personal-center .user-info");
    await page.screenshot({path: './screenshots/settingpage.png', type:'png'});
    const $loginBtn = await page.$("#personal-center .user-info");
    if ($loginBtn) {
        await $loginBtn.click();
    }
    /** Now login with password and username **/
    await page.waitForSelector(".na-insert-form");
    await page.screenshot({path: './screenshots/loginpage.png', type:'png'});
    const $loginForm = await page.$(".na-insert-form");
    const $userNameInput = await $loginForm.$(".na-input-text");
    // const $passwordInput = await $loginForm.$("#login-password");
    await $userNameInput.type(baiduAccount.username, {delay: 300});
    // await $passwordInput.type(baiduAccount.password, {delay: 300});
    const $submitBtn = await $loginForm.$("input.na-submit-button").catch(err => {
        console.error(err)
    });
    await $submitBtn.click().catch(err => {
        console.error(err)
    });
    await page.screenshot({path: './screenshots/username.png', type:'png'});
    /**  input password **/
    await page.waitForSelector(".pass-section");
    // const $passwordInput = await page.$('input[autocomplete=current-password]');
    // await $passwordInput.type(baiduAccount.password, {delay: 300});
    // const $loginInput = await page.$('input.na-submit-button')
    // $loginInput.click();
    // await page.screenshot({path: './screenshots/loginfinished.png', type:'png'});
    browser.close();
});