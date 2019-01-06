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

/** flush current text file. */
let today = new Date();
let dataFile = path.resolve(domSites.sites[0].screenPath, [today.getFullYear(), '-', today.getMonth() + 1 , '-' , today.getDate(), '.text'].join(""));
fs.writeFileSync(dataFile, [today.toLocaleString(), "数据记录", '\n\n'].join(" "), {flag: 'w'});

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

        //detecting notice popup
        let $notice = await page.$('.notice_header button');
        if ($notice) {
            await $notice.click().catch((err) => {
                console.log('广告框未显示');
            });
        }
        
        if ($targetDom) {
            console.log("记录" + site.name + "数据");
            let children = await $targetDom.$$eval(site.childrenSelector, (nodes) => {
                return nodes.map((node) => {
                    return node.innerText;
                });
            });

            children = children.filter((node) => {
                return !!node.trim();
            }).map((node) => {
                return node.replace(/(\n+)/, '\n').replace(/•\s+/g, "").split('\n').filter((splitNode) => {
                    return !!splitNode.trim();
                });
            });

            let dataContent = site.name + ':\n';
            children.forEach((dataGroup) => {
                let half = dataGroup.length/2;
                for(let i = 0; i < half; i++) {
                    dataContent = dataContent + ((site.reverse) ? [dataGroup[ i + half], ': ', dataGroup[i]].join("") : [dataGroup[i], ': ', dataGroup[ i + half]].join("")) + '\n';
                    dataContent = dataContent.replace(/,/g, "");
                } 
            });
            dataContent = dataContent + '\n';
            fs.writeFileSync(dataFile, dataContent, {flag: 'a+'});
        }
    }
    await browser.close();
    console.log("获取完毕");
});