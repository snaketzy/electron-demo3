const {BrowserWindow, app} = require("electron");
const pie = require("puppeteer-in-electron")
const puppeteer = require("puppeteer-core");

const main = async () => {
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);

  const window = new BrowserWindow({
    width: 1366,
    height: 768
  });
  const url = "https://testlogin.viphrm.com/";
  await window.loadURL(url);

  const page = await pie.getPage(browser, window);
  console.log(page.url());
};

main();
