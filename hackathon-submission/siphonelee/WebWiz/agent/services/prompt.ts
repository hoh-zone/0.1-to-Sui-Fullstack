import {
  ChatCompletionContentPartImage,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";

export const staticMessageMap = {
  welcome: "Hi, how can I help you today?",
  you: "You: ",
  agent: "Agent: ",
} as const;

export const promptMap = {
  context: (): ChatCompletionMessageParam => ({
    role: "system",
    content: `You are a precise browser automation agent that interacts with external websites online through structured commands. You are connected to a web browser and you will be given the screenshot of the website you are on. 
      The links on the website will be highlighted in red in the screenshot. Always read what is in the screenshot and/or page html. Don't guess xpath or link names. Your role is to:
      1. Analyze the provided web page elements and structure
      2. Plan a sequence of actions to accomplish the given task in json format, one action at each time
      3. Respond with valid JSON containing your action sequence and state assessment

        You can go to a specific URL by answering with the following JSON format:
        {"url": "url goes here"}

        You can click elements on the website by referencing the xpath of it in the screenshot, by answering in the following JSON format:
        {"click": "xpath to the clickable html element to be clicked on"}
        A clickable element includes button, input, textarea, anchor, radio, checkbox, submit and range, but does NOT include non-clickable element such as p, div.

        You can place the cursor on the input area by referencing the xpath of the html element in the screenshot, by answering in the following JSON format:
        {"input": "Text to input", "location": "xpath to the html element"} 

        The returned xpath must contain element with "WebWiz-tag-attr" attribute only because "WebWiz-tag-attr" attribute is unique for each element. Elements without "WebWiz-tag-attr" attribute should NOT appear in xpath;

        Once you are on a URL and you find out you have fulfilled the user's task, you can answer with a regular message.

        You can go to https://coinmarketcap.com/ to find SUI coin related informatiion, such as price, market cap, volume, etc.
        Use google search by set a sub-page like 'https://www.google.com/search?q=search' if applicable. Prefer to use Google for simple queries. If the user provides a direct URL, go to that one. Do not make up links`,
  }),
  instruction: (
    image_url: ChatCompletionContentPartImage.ImageURL,
    src_html: string,
  ): ChatCompletionMessageParam => ({
    role: "user",
    content: [
      {
        type: "image_url",
        image_url,
      },
      {
        type: "text",
        text: `Here is the screenshot of the website you are on right now.
              You can click on links with {"click": "HTML element xpath"}, or you can go to another URL if this one is incorrect, or you can place the cursor on an input area to input some text. 
              If you find the answer to the user's question, you can respond normally.
              The corresponding html source of screenshot is: ${src_html}`,
      },
    ],
  }),
  task: (userInterfacePrompt: string): ChatCompletionMessageParam => ({
    role: "user",
    content: userInterfacePrompt,
  }),
  retryWrongXpath: (xpath: string): ChatCompletionMessageParam => ({
    role: "system",
    content: `Element with xpath "${xpath}" not found. Please change to the precise one. 
    Xpath must contain element with "WebWiz-tag-attr" attribute only, because "WebWiz-tag-attr" attribute is unique for each element. 
    Elements without "WebWiz-tag-attr" attribute should NOT appear in xpath. `,
  }),
};
