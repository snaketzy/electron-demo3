const {BrowserWindow, app} = require("electron");
const pie = require("puppeteer-in-electron")
const puppeteer = require("puppeteer-core");
const { createCursor, installMouseHelper } = require('ghost-cursor');

/** 发布职位 div */
const element1 = "div.add-btn";
/** 职位名称 input */
const element2 = ".job-name-input";

const delay = (time) => {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

const main = async () => {
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);

  const window = new BrowserWindow({
    width: 1366,
    height: 768
  });
  const url = "https://www.zhipin.com/web/chat/job/list";
  await window.loadURL(url);

  const page = await pie.getPage(browser, window);

  // test1(page)

  // test2(page)

  test3(page)

  // test4(page)
};

const test1 = async(page) => {
  await page.waitForSelector("div.page-name");
  
  // await installMouseHelper(page);
  
  // const cursor = createCursor(page);

  const element1 = await page.$("div.page-name");
  
  // const element = await cursor.getElement("div.add-btn")
  // const location = await cursor.getLocation(element1)
  
  // 获取元素坐标和尺寸
  // const boundingBox = await element1.boundingBox();
   
  // 计算元素中心点坐标
  // const x = boundingBox.x + boundingBox.width / 2;
  // const y = boundingBox.y + boundingBox.height / 2;
  

  // await cursor.move(element1)
  // await cursor.move(element2)
  // await cursor.click(element1)
  debugger
}

const test2 = async(page) => {
   const frame = await page.waitForFrame(async frame => {
    return frame.url().includes("web/chat/job/list")
  });
  debugger
  const element = await page.$("div.add-btn")
  debugger
  await page.click(element)
}

const test3 = async(page) => {
  const frames = page.frames();
  let frame = null;
  for (const currentFrame of frames) {
    if (currentFrame.url().includes('/web/frame/job/list-new')) {
      frame = currentFrame;
      break;
    }
  }
  if (frame) {
    const element =await frame.waitForSelector(element1,{
      visible: true
    })
    const text = await frame.$eval('div.add-btn', ele => ele.textContent);
    // await frame.click(element,{debugHighlight: true,})
    console.log(text);
    const btn = await frame.$(element1)
    await btn.click({delay: 2000})
    delay(2000).then(() => test5(page))

  } else {
    console.error('Frame with name "myframe" not found.');
  }
}

const test4 = async(page) => {
  let targetFrame;
  page.on('frameattached', async (frame) => {
    // 通过 URL 特征识别目标 frame（无 name 属性）
    if (frame.url().includes('web/chat/job/list')) {
      targetFrame = frame;
      console.log('Frame attached:', frame.url());
      debugger
      // 3. 监听 frame 导航完成事件
      frame.on('framenavigated', async () => {
        console.log('Frame navigated to:', frame.url());
        debugger
        try {
          // 4. 等待 frame 内特定元素加载完成
          await targetFrame.waitForSelector('div.add-btn', {
            visible: true,
            timeout: 10000
          });
          debugger
          // 5. 在 frame 上下文中提取数据
          // const frameData = await targetFrame.evaluate(() => {
          //   const items = Array.from(document.querySelectorAll('.item'));
          //   return items.map(item => ({
          //     title: item.querySelector('.title').innerText,
          //     link: item.querySelector('a').href
          //   }));
          // });
          
          console.log('Extracted data:', frameData);
        } catch (error) {
          console.error('操作 frame 失败:', error.message);
        }
      });
    }
  });
}

const test5 = async(page) => {
  // const input = await frame.$(element2,{timeout: 100000})
  
  const frames = page.frames();
  let frame = null;
  for (const currentFrame of frames) {
    if (currentFrame.url().includes('/web/frame/job/edit')) {
      frame = currentFrame;
      break;
    }
  }
  
  if (frame) {
    const element =await frame.waitForSelector(element2,{
      visible: true
    })
    await frame.type(element2,"测试Puppeteer对boss平台的自动化能力",{delay: 2000})

  } else {
    console.error('Frame with name "myframe" not found.');
  }
    
}

main();
