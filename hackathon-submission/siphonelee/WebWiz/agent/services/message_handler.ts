import fs from "fs";
import { isValidImagePath, isValidJson, cleanXpath } from "../utils.ts";

export enum ResponseMessageType {
  INITIAL = "initial",
  URL = "url",
  CLICK = "click",
  INPUT = "input",
  REGULAR = "regular",
}

type ResponseActionMessageType = Extract<
  ResponseMessageType,
  ResponseMessageType.CLICK | ResponseMessageType.URL | ResponseMessageType.INPUT
>;

export type ResponseMessage =
  | {
      type: ResponseMessageType.URL;
      url: string;
    }
  | {
      type: ResponseMessageType.CLICK;
      xpath: string;
    }
  | {
      type: ResponseMessageType.INPUT;
      content: string;
      xpath: string;
    }
  | {
      type: ResponseMessageType.INITIAL;
      text: "initial";
    }
  | {
      type: ResponseMessageType.REGULAR;
      text: string;
    };

//TODO: add one more response type: GO BACK - because LLM does not store all the history of the navigation. It cannot go back to the previous page directly.

const URI_PREFIX = "data:image/jpeg;base64,";
const RESPONSE_MESSAGE_ACTION_START_INDICATOR: Record<
  ResponseActionMessageType,
  string
> = {
  [ResponseMessageType.URL]: '{"url": "',
  [ResponseMessageType.CLICK]: '{"click": "',
  [ResponseMessageType.INPUT]: '{"input": "',
};
const RESPONSE_MESSAGE_ACTION_END_INDICATOR_1 = '"}';
const RESPONSE_MESSAGE_ACTION_END_INDICATOR_2 = '",';

export const imageToBase64String = async (imageFilePath: string) => {
  if (!isValidImagePath(imageFilePath)) {
    throw new Error("Invalid image file path");
  }
  try {
    const data = await fs.promises.readFile(imageFilePath);
    const base64String = data.toString("base64");
    const dataURI = `${URI_PREFIX}${base64String}`;
    return dataURI;
  } catch (err) {
    throw new Error(`Error reading file from disk: ${err}`);
  }
};

export const extractActionFromString = (string: string, type: ResponseActionMessageType) => {
  let action: string | null = null;

  if (isValidJson(string)) {
    const parsedObject = JSON.parse(string);
    action = type in parsedObject ? parsedObject[type] : null;
  }

  // to resolve potential response message text like 'The url is {"url": "url goes here"}'
  if (action === null && string.includes(RESPONSE_MESSAGE_ACTION_START_INDICATOR[type])) {
    action = string
      .split(RESPONSE_MESSAGE_ACTION_START_INDICATOR[type])[1]
      .split(RESPONSE_MESSAGE_ACTION_END_INDICATOR_1)[0]
      .split(RESPONSE_MESSAGE_ACTION_END_INDICATOR_2)[0];
  }

  return action;
};

export const extractAttrFromString = (string: string, attr: string) => {
  let value: string | null = null;

  if (isValidJson(string)) {
    const parsedObject = JSON.parse(string);
    value = attr in parsedObject ? parsedObject[attr] : null;
  }

  // to resolve potential response message text like 'The answer is {"input": "hello world!", "xpath": "..."}'
  const m = "\"" + attr + "\": \"";
  if (value === null && string.includes(m)) {
    value = string
      .split(m)[1]
      .split(RESPONSE_MESSAGE_ACTION_END_INDICATOR_1)[0];
  }

  return value?.replace('\"', '"');
};


export const convertTextToResponseMessageArray = (text: string): ResponseMessage[] => {
  const regex = /^\[(.*)\]/i;
  const matches = text.match(regex);
  if (!!matches) {
    const items = matches[1].split('},');
    return items.map((item) => {
      return convertTextToResponseMessage(item.trim() + "}");
    });
  } else {
    // console.log("not match: " + text);
    return [convertTextToResponseMessage(text)];
  }
};


export const convertTextToResponseMessage = (text: string): ResponseMessage => {
  console.log(text);
  if (extractActionFromString(text, ResponseMessageType.URL) !== null) {
    return {
      type: ResponseMessageType.URL,
      url: extractActionFromString(text, ResponseMessageType.URL) as string,
    };
  }

  if (extractActionFromString(text, ResponseMessageType.CLICK) !== null) {
    return {
      type: ResponseMessageType.CLICK,
      xpath: cleanXpath(extractActionFromString(text, ResponseMessageType.CLICK) as string),
    };
  }

  if (extractActionFromString(text, ResponseMessageType.INPUT) !== null) {
    return {
      type: ResponseMessageType.INPUT,
      content: extractActionFromString(text, ResponseMessageType.INPUT) as string,
      xpath: cleanXpath(extractAttrFromString(text, "location") as string),
    };
  }

  if (text === ResponseMessageType.INITIAL) {
    return {
      type: ResponseMessageType.INITIAL,
      text,
    };
  }

  return {
    type: ResponseMessageType.REGULAR,
    text,
  };
};
