### Puppeteer UI 自动测试范例

#### 简介
本列使用 puppeteer 进行了简单的 UI 操作模拟

#### 使用
 + 安装 Puppeteer

 npm i puppeteer 

>如果安装过程中下载 chromium 失败，那么可以在安装的时候跳过 chromium 下
>载使用: PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm i puppeteer  安装。安装后，自行下载一个 chromium 浏览器比如 ：https://storage.googleapis.com/chromium-browser-snapshots/Mac/515411/chrome-mac.zip


+ 准备node执行环境

使用 Node v7.6.0 以上版本

+ 准备一个百度登陆账户将账户

将账号密码放置到 config/baidu.json 文件中
<code>
{
    "username": "北野侯",
    "password": "xxxxxxx"
}
</code> 

+ 指定可执行浏览器路径

如果安装puppeteer时下载 chromium 成功未手动下载那么不需要配置。如果是手动下载的，将执行路径写到 config/chromium.json 文件中。 

<code>
{"executablePath": "path/to/chromium"}
</code>

+ 运行

<code>node autologin.js</code>