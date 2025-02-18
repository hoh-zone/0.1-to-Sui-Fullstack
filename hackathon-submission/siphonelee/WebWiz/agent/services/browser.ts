import dotenv from "dotenv";
dotenv.config();
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {
  isPageExplicitlyLoading,
  isValidURL,
  rectifyXpath,
  sleep,
  waitTillHTMLRendered,
} from "../utils.ts";
import { Browser, ElementHandle, Page } from "puppeteer";
import { highlightInteractiveElements } from "./tagger.ts";
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import { imageSize } from 'image-size';
import sharp from 'sharp';

export const TIMEOUT = 30000;

const imageName = "WebWiz-screenshot.png";
const imagePath = "./agent/" + imageName;
const croppedImageName = imageName + ".cropped.png";
const croppedImagePath = "./agent/" + croppedImageName;
const compressedImagePath = "./agent/screenshot-comp/" as const;
const browserWindowSize = { width: 1200, height: 1600 };

export const initController = async () => {
  const pup = puppeteer.default.use(StealthPlugin());
  const browser = await pup.launch({
    headless: false,
    executablePath: process.env.GOOGLE_CHROME_CANARY_PATH,
    userDataDir: process.env.GOOGLE_CHROME_CANARY_USER_DATA_DIR,
    args: [
      `--profile-directory=${process.env.PROFILE}`,
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--no-zygote",
      `--window-size=${browserWindowSize.width},${browserWindowSize.height}`,
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: browserWindowSize.width,
    height: browserWindowSize.height,
    deviceScaleFactor: 1,
  });

  return { browser, page };
};

export const screenshot = async (url: string, page: Page) => {
  console.log(`...Opening ${url}`);
  if (!isValidURL(url)) {
    throw new Error(`Invalid URL: ${url}`);
  }
  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: TIMEOUT,
    });

    const {imagePath, pageSourceHTML} = await getPageScreenshotAndSrc(page);
    return {imgPath: imagePath, sourceHtml: pageSourceHTML};
  } catch (err) {
    console.log(`Error taking screenshot: ${err}`);
    return {imgPath: undefined, sourceHtml: ''};
  }
};


export const clickNavigationAndScreenshot = async (xpath: string, page: Page, browser: Browser) => {
  let imgPath, sourceHTML;
  try {
    const navigationPromise = page.waitForNavigation();
    const clickResponse = await clickElement(xpath, page);
    await new Promise(f => setTimeout(f, 1000));
    if (!clickResponse) {
      // calvin
      // await navigationPromise;
      navigationPromise.catch(() => undefined);

      let {imagePath, pageSourceHTML} = await getPageScreenshotAndSrc(page);
      imgPath = imagePath;
      sourceHTML = pageSourceHTML;
    } else {
      // the link opens in a new tab?
      navigationPromise.catch(() => undefined);
      const newPage = await openNewTab(clickResponse, page, browser);

      if (newPage === undefined) {
        throw new Error("The new page cannot be opened");
      }

      let {imagePath, pageSourceHTML}  = await getPageScreenshotAndSrc(newPage);
      imgPath = imagePath;
      sourceHTML = pageSourceHTML;
    }

    return {imgPath, sourceHTML};
  } catch (err) {
    throw err;
  }
};

const clickElement = async (xpath: string, page: Page): Promise<string | any> => {
  try {
    const isHTMLElement = (element: Element): element is HTMLElement => {
      return element instanceof HTMLElement;
    };
  
    xpath = rectifyXpath(xpath);
    console.log(xpath);
    const elements = await page.$x(xpath);
    
    for (const ele of elements) {
      const each = (ele as ElementHandle<Element>);
      
      await page.evaluate((element) => {
        const e = element as HTMLElement;
        if (!e) return;
        
        if (e.getAttribute("target") === "_blank") {
          return e.getAttribute('WebWiz-tag-attr');
        }
        
        e.style.backgroundColor = "rgba(255,255,0,0.25)";
      }, each);

      await each.click();
      return;        
    }

    // only if the loop ends without returning
    throw new Error(`Link with xpath not found: "${xpath}"`);
  } catch (err) {
    // console.log(`Error clicking on element: ${err}`);
    if (err instanceof Error) {
      throw err;
    }
  }
};

const openNewTab = async (gptLinkText: string, page: Page, browser: Browser) => {
  try {
    const currentPageTarget = page.target();

    const element = await page.$(`[WebWiz-tag-attr="${gptLinkText}"]`);

    if (element === null) {
      throw new Error("The element is null");
    }

    element.click();

    const newPageTarget = await browser.waitForTarget(
      (target) => target.opener() === currentPageTarget
    );

    // switch to the new page:
    const newPage = await newPageTarget.page();
    if (newPage === null) {
      throw new Error("The new page is null");
    }

    // wait for page to be loaded (briefly)
    await newPage.waitForSelector("body");
    return newPage;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
};

export const getPageScreenshotAndSrc = async (page: Page) => {
  const isLoading = await isPageExplicitlyLoading(page);
  isLoading && (await waitTillHTMLRendered(page));

  console.log(`Highlight all interactive elements...`);
  await highlightInteractiveElements(page);

  console.log(`Taking screenshot...`);

  const pageSourceHTML = await page.content();
  // console.log(pageSourceHTML);

  await page.screenshot({
    path: imagePath,
    fullPage: true,
  });

  await compressImage();
  return {imagePath: compressedImagePath + croppedImageName, pageSourceHTML};
};

export const compressImage = async() => {
  const dimensions =  imageSize(imagePath);
  const w = dimensions.width as number;
  const h = dimensions.height as number;

  await sharp(imagePath)
    .extract({ left: 0, top: 0, width: w, height: (h<5*w)?h:5*w })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toFile(croppedImagePath);

  await imagemin([croppedImagePath], {
    destination: compressedImagePath,
    plugins: [
      imageminPngquant({
        quality: [0.1, 0.1]
      })
    ]
  });
}