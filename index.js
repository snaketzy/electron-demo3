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
  const url = "https://premoss.viphrm.com/";
  await window.loadURL(url);

  const page = await pie.getPage(browser, window);
  // page.on("response", (response) => {
  //   if(response.url().includes("premoss.viphrm.com") && [".png",".js"].indexOf(response.url()) < 0) {
  //     response.json().then((res) => {
  //       console.log(`${response.url()}.response.json`, res)
  //   })}
  // })
  // console.log(page.url());
  // await page.waitForSelector('a[target="_self"]');
  // const link = await page.$('a[target="_self" and text()="更多应用"]');
  // await link.click();
  
  await page.waitForSelector('a[target="_self"]');

  const element = await page.$("div.flex-vertical");
  
  // 获取元素坐标和尺寸
  const boundingBox = await element.boundingBox();
   
  // 计算元素中心点坐标
  const x = boundingBox.x + boundingBox.width / 2;
  const y = boundingBox.y + boundingBox.height / 2;
  
  await page.mouse.move(x, y, { steps: 20 });

};

main();
