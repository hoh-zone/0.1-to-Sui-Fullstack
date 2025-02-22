import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { aesDecrypt } from './aesUtil';
import { AccountInfo,PasswordObject, callAddPassword, getPasswordObjects } from './0xPasswordUtil';

// 配置存储key
export const SELECTED_ACCOUNT_KEY = 'SELECTED_ACCOUNT';
export const EXTENSION_ID_KEY = 'EXTENSION_ID';
export const MK_KEY = 'MK';
//定义一个map
let innerChannel: chrome.runtime.Port | null = null;
let extChannel: chrome.runtime.Port | null = null;
let EXTENSION_ID: string | null = null;
let mk: string | null = null;
let passwordList : Array<PasswordObject> | null = [];

// 创建带Promise封装的storage访问
export const getStorage = (key: string): Promise<any> => {
  return new Promise(resolve => {
    chrome.storage.local.get([key], result => resolve(result[key]));
  });
};
export const getSessionStorage = (key: string): Promise<any> => {
  return new Promise(resolve => {
    chrome.storage.session.get([key], result => resolve(result[key]));
  });
};

const getStoredEntities = {
  "id": "a65d8fa0-1cda-4273-b137-a0c2af7a9c45",
  "payload": {
    "method": "getStoredEntities",
    "type": "method-payload",
    "args": {
      "type": "accounts"
    }
  }
}

async function initConnection() {
  try {
    let pw = await aesDecrypt("A8TiYHYuTaLLbpCNwmWIQQ==","xkQ4aiD2piPKTEl43K9Zfw==","+fwHkX1m9dgC+90YcktcQQ==","zxcvbnm");
    console.log("log password ", pw);
    EXTENSION_ID = await getStorage(EXTENSION_ID_KEY);
    if (!EXTENSION_ID) throw new Error("未找到扩展ID");

    console.log("获取到扩展ID:", EXTENSION_ID);
    extChannel = chrome.runtime.connect(EXTENSION_ID, { name: 'other_ext<->sui_ui' });
    // 连接建立后操作
    extChannel.postMessage(getStoredEntities);
    extChannel.onMessage.addListener(onExtMessage);
    extChannel.onDisconnect.addListener(message => {
      console.log("断开连接", message);
    });

  } catch (error) {
    console.error("连接初始化失败:", error);
    // 这里可以添加重试逻辑
  }
}

function handleAccountChange(newAccount: AccountInfo) {
  // 使用chrome.storage替代localStorage { [EXTENSION_ID_KEY]: message.data.id }
  chrome.storage.local.set({ [SELECTED_ACCOUNT_KEY]: newAccount });
}

const onExtMessage = async (message: any) => {
  console.log("收到消息", message);
  if (message.payload.method == "signTransactionDataResponse") {
    console.log("签名响应", message);
    const rpcUrl = getFullnodeUrl('testnet');
    const client = new SuiClient({ url: rpcUrl });
    let saveKey = 'tx' + message.id;
    let txData = await getSessionStorage(saveKey);
    console.log("txdata",txData);
    //let txBytes = fromBase64(txData);
    let txResult = await client.executeTransactionBlock({
      transactionBlock: txData,
      signature: message.payload.args.signature,
    });
    innerChannel?.postMessage({ id: message.id, method: "save_password_response", code: 0, args: txResult.digest })
    console.log("txResult", txResult);
  } else if (message.payload.method == "storedEntitiesResponse") {
    let accounts = message.payload.args.entities;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].selected) {
        let acc = accounts[i];
        handleAccountChange(acc);
      }
    }
  }
}

const onInnerMessage = async (message: any) => {
  console.log("onInnerMessage", message);
  if ("save_password" == message.method) {
    mk = await getStorage(MK_KEY);
    if (mk) {
      let { password, url, username } = message.args;
      callAddPassword(extChannel, password, url, username, mk);
    } else {
      console.log("MK not set")
    }
  }else if("getPasswordObjectData" === message.method){
    (async () => {
      const account = await getStorage(SELECTED_ACCOUNT_KEY);
      let mainKey = await getStorage(MK_KEY);
      console.log("getPasswordObjectData account", account, mainKey);
      if(account){
        passwordList = await getPasswordObjects(account.address, message.args.pageOrigin, mainKey) as Array<PasswordObject>;
        innerChannel?.postMessage({method:"getPasswordObjectDataRes", code:0, args:passwordList});
      }else{
        if(extChannel){
          extChannel.postMessage(getStoredEntities);
        }
      }
    })();
    return true;
  }
}

try {

  // 监听来自UI的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'CONFIG_UPDATE') {
    console.log('收到配置更新:', message.data);
    // 存储到chrome.storage
    chrome.storage.local.set({ [EXTENSION_ID_KEY]: message.data.id });
    chrome.storage.local.set({ [MK_KEY]: message.data.key });
    mk = message.data.key;
    EXTENSION_ID = message.data.id;
    return true; // 保持消息通道开放用于sendResponse
  } else if(message.type === 'GET_SELECTED_ACCOUNT'){
    (async () => {
      const account = await getStorage(SELECTED_ACCOUNT_KEY);
      console.log("GET_SELECTED_ACCOUNT rec", account);
      if(account){
        sendResponse({type:"GET_SELECTED_ACCOUNT_RESPONSE", data: account, code:0});
      }else{
        sendResponse({type:"GET_SELECTED_ACCOUNT_RESPONSE", data: {}, code:-1});
        if(extChannel){
          extChannel.postMessage(getStoredEntities);
        }
      }
    })();
    return true;
  }
  return false;
});

  chrome.runtime.onConnect.addListener(function (port) {
    console.log("收到连接", port);
    innerChannel = port;
    port.onMessage.addListener(onInnerMessage);
  });
  console.log('service_worker.js');
  // 在初始化时调用
  chrome.runtime.onStartup.addListener(initConnection);
  chrome.runtime.onInstalled.addListener(initConnection);
  // const signData = {
  //   "id": "d84bff23-ce1e-44b6-87be-36e27db9zxc1",
  //   "payload": {
  //       "type": "method-payload",
  //       "method": "signTransactionData",
  //       "args": {
  //           "data": "AAAAAAAAAQC/I1ivqXxUevd0/yb0aPcX6nrY+1FMtv8HmPbP5T2WNgdjb3VudGVyBmNyZWF0ZQAAkUWZkaPhd4M03EvQB8uQ/pmJpKq/zvTtGQlecSUH6kMBwyBjmXK21uTn6mvxj9D5OqVwlUP55+CWaZaLU+FXW/6UPykUAAAAACC1dj/+ztIaN/TWcg+3wT8VF+N6Lmv2EaVqgFXuF3nfOZFFmZGj4XeDNNxL0AfLkP6ZiaSqv8707RkJXnElB+pD6AMAAAAAAADwD0YAAAAAAAA=",
  //           "id": "db5e13a2-8ba9-4ec9-a7dc-7e1c05236dbc"
  //       }
  //   }
  // }
} catch (error) {
  console.error('worker js error:', error);
}