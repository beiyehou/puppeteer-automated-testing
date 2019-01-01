const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone6 = devices['iPhone 6'];
const domSites = require("./config/domScreenSites.json");
const chromiumConfig = require("./config/chromium.json");
const tools = require('./lib/tools');

let launchOptions = {
    headless: true,
    slowMo: 500
};

if (chromiumConfig.executablePath) {
    launchOptions.executablePath = chromiumConfig.executablePath;
}

/** Testing the screenshots folder and create it if not existing. **/
tools.testandCreateFolder(path.resolve(domSites.screenshot, "./screenshots"));

/** Creating domsites' screenshot folders. **/
domSites.sites.forEach((site) => {
    site.screenPath = path.resolve(domSites.screenshot, "./screenshots");
    tools.testandCreateFolder(site.screenPath);
});

puppeteer.launch(launchOptions).then(async browser => {
    const page = await browser.newPage();
    await page.emulate(iPhone6);

    for(let i = 0; i < domSites.sites.length; i++) {
        let site = domSites.sites[i];
        await page.goto(site.url, {
            timeout: 30*1000,
            waitUntil: 'load'
        }).catch((err) => {
            console.log("page goto error:", err);
        });
        console.log("打开" + site.name + '主页');
        await page.waitForSelector(site.domSelector);
        let $targetDom = await page.$(site.domSelector);
        let today = new Date();
        //detecting notice popup
        let $notice = await page.$('.notice_header button');
        if ($notice) {
            await $notice.click();
        }
        if ($targetDom) {
            console.log("截取" + site.name + '主页');
            await $targetDom.screenshot({
                path: path.resolve(site.screenPath, [today.getFullYear(), '-', today.getMonth() + 1 , '-' , today.getDate(), '-', site.name, '.png'].join("")),
                type: 'png'
            });
        }
    }
    await browser.close();
    console.log("获取完毕");
});