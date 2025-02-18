import { Page } from "puppeteer";
import { ChatCompletionMessageParam, ChatCompletionContentPart, ChatCompletionUserMessageParam } from "openai/resources/index.mjs";

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const sleep = async (delayMillis: number): Promise<string> => {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve(`Waited for ${delayMillis / 1000} seconds`);
      return;
    }, delayMillis)
  );
};

export const isValidImagePath = (filePath: string): boolean => {
  const regex = /\.(jpg|jpeg|png)$/i;
  return regex.test(filePath);
};

export const isValidURL = (txt: string | undefined) => {
  if (txt === undefined) {
    return false;
  }
  const pattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  return pattern.test(txt);
};

export const isValidJson = (string: string) => {
  try {
    JSON.parse(string);
  } catch (err) {
    return false;
  }

  return true;
};


export const fixUrl = (url: string): string => {
  return url.replaceAll(" ", "+");
};


export const cleanXpath = (xpath: string): string => {
  xpath = xpath.trim();
  if (xpath.startsWith("xpath=//")) {
  } else if (xpath.startsWith("//")) {
    xpath = "xpath=" + xpath;
  }
  return xpath;
};

export const rectifyXpath = (xpath: string): string => {
  xpath = xpath.trim();
  if (xpath.startsWith("xpath=//") || xpath.startsWith("xpath://")) {
    xpath = xpath.slice(6);
  }
  return xpath;
};

export const ensureXpathPrefix = (xpath: string): string => {
  xpath = xpath.trim();
  if (xpath.startsWith("xpath=//")) {
  } else if (xpath.startsWith("xpath://")) {
    xpath = xpath.slice(6);
    xpath = "xpath=" + xpath;
  } else if (xpath.startsWith("//")) {
    xpath = "xpath=" + xpath;
  }
  return xpath;
};

export const removeElementTypeFromXpath = (xpath: string): string => {
  xpath = xpath.trim();
  return xpath.replaceAll("div[@", "*[@");
};

export const cleanMessage = (messageText: string): string => {
  messageText = messageText.trim();
  messageText = messageText.replace(/[\n\r\t]/gm, "");
  messageText = messageText.replace(/\{\s+/gi, '{'); 
  messageText = messageText.replace(/\s+\}/gi, '}'); 
  if (messageText.startsWith("```json") && messageText.endsWith("```")) {
    messageText = messageText.slice(7);
    messageText = messageText.slice(0, -3);
  }

  return messageText;
};

export const isElementStyleVisible = (element: Element) => {
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    style.width !== "0px" &&
    style.height !== "0px"
  );
};

export const isElementInViewport = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const isElementVisible = (element: Element | undefined | null) => {
  if (element === null || element === undefined) {
    throw new Error("isElementVisible: Element is null or undefined");
  }

  let currentElement: Element | null = element;

  while (currentElement) {
    if (!isElementStyleVisible(currentElement)) {
      return false;
    }

    currentElement = currentElement.parentElement;
  }

  return isElementInViewport(element);
};

export const isHTMLElement = (element: Element): element is HTMLElement => {
  return element instanceof HTMLElement;
};

export const waitTillHTMLRendered = async (page: Page, timeout: number = 30000, checkOnlyHTMLBody: boolean = false) => {
  const waitTimeBetweenChecks: number = 1000;
  const maximumChecks: number = timeout / waitTimeBetweenChecks; // assuming check itself does not take time
  let lastHTMLSize = 0;
  let stableSizeCount = 0;
  const COUNT_THRESHOLD = 3;

  const isSizeStable = (currentSize: number, lastSize: number) => {
    if (currentSize !== lastSize) {
      return false; // still rendering
    } else if (currentSize === lastSize && lastSize === 0) {
      return false; // page remains empty - failed to render
    } else {
      return true; // stable
    }
  };

  for (let i = 0; i < maximumChecks; i++) {
    const html = await page.content();
    const currentHTMLSize = html.length;

    const currentBodyHTMLSize = await page.evaluate(
      () => document.body.innerHTML.length
    );

    const currentSize = checkOnlyHTMLBody
      ? currentBodyHTMLSize
      : currentHTMLSize;

    console.log("last: ", lastHTMLSize, " <> curr: ", currentHTMLSize, " body html size: ", currentBodyHTMLSize);

    stableSizeCount = isSizeStable(currentSize, lastHTMLSize)
      ? stableSizeCount + 1 // cannot use stableSizeCount++ because it will return the original value of stableSizeCount
      : 0;

    console.log(`Stable size count: ${stableSizeCount}`);

    if (stableSizeCount >= COUNT_THRESHOLD) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentSize;
    await page.waitForTimeout(waitTimeBetweenChecks); // remember to await
  }
};

export const isPageExplicitlyLoading = async (page: Page) => {
  const targetClassNames = ["loading", "progress", "spinner", "wait"] as const;
  const selectors = targetClassNames.map(
    (className) =>
      `[class*="${className}"], [class*="${capitalize(
        className
      )}"], [class*="${className.toUpperCase()}"]`
  );

  // document readState can be `complete` while the page is still loading
  return page.evaluate((selectors) => {
    const loadingElement = document.querySelector(selectors.join(", "));

    return (
      document.readyState === "loading" ||
      (loadingElement !== null &&
        (loadingElement as HTMLElement).style.display !== "none")
    );
  }, selectors);
};

export const truncateUnnecessaryMessages = (messages: ChatCompletionMessageParam[]) => {
  let idx = messages.length - 1;
  while (idx >= 0) {
    const msg = messages[idx];
    if (msg.role == 'user') {
      if (typeof msg.content !== 'string') {
        // the previous image
        break;
      }
    }

    idx = idx - 1;
  }

  if (idx >= 0) {
    const n = messages.length - idx;
    messages.splice(-n, n);
  }
};