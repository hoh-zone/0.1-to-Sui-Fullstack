import { ChatCompletionMessageParam, ChatCompletionContentPart } from "openai/resources/index.mjs";
import {
  clickNavigationAndScreenshot,
  initController,
  screenshot,
  compressImage,
  getPageScreenshotAndSrc,
} from "./services/browser.ts";
import { promptMap, staticMessageMap } from "./services/prompt.ts";
import { userPromptInterface } from "./services/user_prompt_interface.ts";
import { openai } from "./services/openai.js";
import {
  ResponseMessageType,
  convertTextToResponseMessageArray,
  imageToBase64String,
} from "./services/message_handler.ts";
import { cleanMessage, rectifyXpath, ensureXpathPrefix, removeElementTypeFromXpath, fixUrl, truncateUnnecessaryMessages, sleep } from "./utils.js";

const messages: ChatCompletionMessageParam[] = [];

function printMessages() {
  console.log("*****************************************************************");
  for (var m of messages) {
    if (!!m.content) {
      if (typeof m.content === "string") {
        console.log("+++ " + m.role + ": " + m.content.substring(0, 1000));
      } else {
        for (var c of (m.content as ChatCompletionContentPart[])) {
          if (c.type !== "image_url") {
            console.log("+++ " + m.role + "/" + c.type + ": " + c.text.substring(0, 1000));
          } else {
            console.log("+++ " + m.role + "/" + c.type + ": (BASE64)");
          }
        }  
      }
    } 
  }
  console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
}

async function handleResponse(messageText: string): Promise<boolean> {
  messageText = cleanMessage(messageText);
  console.log(`${staticMessageMap.agent}${messageText}`);

  // Memorize the answer from agent
  messages.push({
    role: "assistant",
    content: messageText,
  });

  const responseMessages = convertTextToResponseMessageArray(messageText);
  console.log(responseMessages);

  for (const responseMessage of responseMessages) {
    if (responseMessage.type === ResponseMessageType.URL) {
      let { url } = responseMessage;
      url = fixUrl(url);

      console.log("----------go to: " + url + "---------");
      const {imgPath, sourceHtml} = await screenshot(url, page);

      if (imgPath === undefined) {
        throw new Error("The screenshot path is undefined");
      }

      const base64String = await imageToBase64String(imgPath);
      messages.push(
        promptMap.instruction(
          {
            url: base64String,
            detail: "auto",
          },
          sourceHtml,
        )
      );
      break;
    }

    if (responseMessage.type === ResponseMessageType.CLICK) {
      let { xpath } = responseMessage;
      xpath = removeElementTypeFromXpath(xpath);
      console.log("----------click: " + xpath + "---------");

      try {
        const {imgPath, sourceHTML} = await clickNavigationAndScreenshot(
          xpath,
          page,
          browser
        );
        if (imgPath === undefined) {
          throw new Error("The screenshot path is undefined");
        }

        truncateUnnecessaryMessages(messages);
        const base64String = await imageToBase64String(imgPath);
        messages.push(
          promptMap.instruction(
            {
              url: base64String,
              detail: "auto",
            },
            sourceHTML)
        );

        break;
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("xpath not found")
        ) {
          console.log(`...Error clicking on element ${xpath}: ${err.message}`);
          messages.push(promptMap.retryWrongXpath(xpath));
          break;
        } else {
          console.log(`...Unexpected error: ${err}. Please try again.`);
          break;
        }
      }
    }

    if (responseMessage.type === ResponseMessageType.INPUT) {
      let { content, xpath } = responseMessage;
      console.log("----------input: " + xpath + "---------");
      console.log("content: " + content);
      xpath = ensureXpathPrefix(xpath);
      console.log("xpath: " + xpath);

      try {
        // calvin: the xpath needs to be prefixed with "xpath=" here
        await page.click(xpath);
        await page.keyboard.type(content);

        const {imagePath, pageSourceHTML} = await getPageScreenshotAndSrc(page);
        if (imagePath === undefined) {
          throw new Error("The screenshot path is undefined");
        }

        truncateUnnecessaryMessages(messages);

        const base64String = await imageToBase64String(imagePath);
        messages.push(
          promptMap.instruction(
            {
              url: base64String,
              detail: "auto",
            },
            pageSourceHTML)
        );

        break;
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("xpath not found")
        ) {
          console.log(`...Error clicking on element ${xpath}: ${err.message}`);
          //calvin: messages.push(promptMap.retryIfLinkNotFound(linkText));
          break;
        } else {
          console.log(`...Unexpected error: ${err}. Please try again.`);
          break;
        }
      }      
    }

    if (responseMessage.type === ResponseMessageType.REGULAR) {
      return true;
    }
  }
  return false;
}

// STEP 1: Welcome the user
console.log(staticMessageMap.welcome);

// STEP 2: provide the context of the conversation
messages.push(promptMap.context());

// STEP 3: Ask and apply the user's query as a task
const userPrompt = await userPromptInterface(staticMessageMap.you);
messages.push(promptMap.task(userPrompt));

const { browser, page } = await initController();

const taskFlow = async (): Promise<void> => {
  while (true) {
    console.log(`${staticMessageMap.agent}Thinking...`);
    try {
      printMessages();
      const response = await openai.chat.completions.create({
        // calvin
        // model: "google/gemini-2.0-pro-exp-02-05:free",
        model: "google/gemini-2.0-flash-thinking-exp:free",
        // model: "gemini-2.0-pro-exp-02-05",
        messages,
        temperature: 0,
      }).catch(error => {
        console.error("An error occurred while calling AI model service API:", error);
        throw error;
      });

      // For the initial conversation, the agent will provide the url (google search if not applicable)
      console.log(response);

      const { message } = response.choices[0];
      let { content: messageText } = message;
      if (messageText === null) {
        throw new Error("The response message text is null");
      }

      const shouldStop = await handleResponse(messageText);
      if (shouldStop) break;
    } catch {
      break;
    }

    await sleep(10000);
  }
};

await taskFlow();

// await compressImage();

// let res = convertTextToResponseMessageArray('{"click": "//*[contains(text(), \'X\') and @aria-label=\'close\']"}');
// console.log(res);
/*
let {imgPath, sourceHtml} = await screenshot("https://app.bucketprotocol.io", page);
// await waitAndScreenshot(page);
await clickNavigationAndScreenshot(
  "xpath=//*[text()='Earn']",
  page,
  browser
);

// await page.click("xpath=//*[text()='Sui Wallet']");
await new Promise(f => setTimeout(f, 3000));
*/
// await page.click("xpath=//*[text()='Get'][ancestor::*[@data-tracktype='Sui Wallet']]");
/*
await page.keyboard.type("hello world");

let {imgPath: img, sourceHTML: html} = await clickNavigationAndScreenshot(
  "xpath=//*[@data-testid='tweetButtonInline']",
  page,
  browser
);
*/
