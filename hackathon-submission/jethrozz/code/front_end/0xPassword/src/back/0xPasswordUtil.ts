import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { toBase64 } from '@mysten/sui/utils';
import { aesEncrypt, aesDecrypt } from './aesUtil';

// 账户信息接口
export interface AccountInfo {
    id: string; // UUID格式
    type: string; // 固定类型
    address: `0x${string}`; // 0x开头的HEX地址
    isLocked: boolean;
    derivationPath: string; // BIP44路径
    publicKey: string; // Base64编码的公钥
    sourceID: string; // 源ID(UUID)
    lastUnlockedOn: string | null; // ISO时间戳或null
    selected: boolean;
    nickname: string | null;
    isPasswordUnlockable: boolean;
    isKeyPairExportable: boolean;
}

interface SignRequest {
    id: string;
    payload: {
        type: "method-payload";
        method: "signTransactionData";
        args: {
            data: string;
            id: string;
        };
    };
}
const getStorage = (key: string): Promise<any> => {
    return new Promise(resolve => {
      chrome.storage.local.get([key], result => resolve(result[key]));
    });
};

export type PasswordObject = {
  id: string,
  iv: string,
  pw: string,
  username: string,
  salt: string,
  website: string
}
type PasswordNodeObject = {
  address: {
    objects: {
      edges: Array<{
        node: {
          contents: {
            json: {
              id: string,
              iv: string,
              pw: string,
              username: string,
              salt: string,
              website: string
            }
          }
        }
      }>
    }
  }
};
// 快速生成方法
function createSignRequest(data: string, argsId: string): SignRequest {
    return {
        id: crypto.randomUUID(), // 使用浏览器内置UUID生成
        payload: {
            type: "method-payload",
            method: "signTransactionData",
            args: {
                data,
                id: argsId
            }
        }
    };
}

export async function callAddPassword(port: chrome.runtime.Port | null, pw: string, webSite: string, user: string, mk: string | null){
    if(!port){
        throw new Error("未同钱包插件建立连接");
    }
    let {encryptedData, salt, iv} = await aesEncrypt(pw, mk);
    const tx = new Transaction();
    tx.setSender('0x91459991a3e1778334dc4bd007cb90fe9989a4aabfcef4ed19095e712507ea43');
    //add_password(website: String,username : String, pw : String, iv : String, salt : String, ctx : &mut TxContext){
    tx.moveCall({
      package: "0xe97359510c7a9a4c864580cf2bdf10b9a12ae432a037064bdc42dde3ea761d44",
      module: 'PasswordManager',
      function: 'add_password',
      arguments: [
        tx.pure(bcs.string().serialize(webSite).toBytes()), //
        tx.pure(bcs.string().serialize(user).toBytes()),
        tx.pure(bcs.string().serialize(encryptedData).toBytes()),
        tx.pure(bcs.string().serialize(iv).toBytes()),
        tx.pure(bcs.string().serialize(salt).toBytes())
        ]
  });
  const rpcUrl = getFullnodeUrl('testnet');
  getStorage
  let account = await getStorage("SELECTED_ACCOUNT") as AccountInfo;
  if(!account){
    throw new Error("当前未选择有效账户");
  }
  // create a client connected to devnet
  const client = new SuiClient({ url: rpcUrl });
  try {
    (async () => {
     let txBytes = await tx.build({ client });
     console.log("txBytes", txBytes);
     let txData = toBase64(txBytes);
     let signData = createSignRequest(txData, account.id);
     let savekey = "tx"+signData.id;
     chrome.storage.session.set({[savekey]:txData});
     port.postMessage(signData);  // 通过扩展进行签名
    })();
  } catch (e) {
      console.log("tx build error", e);
    }
}

export async function getPasswordObjects(addr: string, pageOrigin : string, mk: string): Promise<Array<PasswordObject>> {
  const suiGraphQLClient = new SuiGraphQLClient({
    url: import.meta.env.VITE_SUI_GRAPHQL_URL || "https://sui-testnet.mystenlabs.com/",
  })
  let data = (await suiGraphQLClient.query({
    query: `
    query($addr: SuiAddress!) {
address(address: $addr) {
  objects(filter: {type: "0xe97359510c7a9a4c864580cf2bdf10b9a12ae432a037064bdc42dde3ea761d44::PasswordManager::Password"}) {
    edges {
      node {
        version
        status
        address
        digest
        owner {
          ... on AddressOwner {
            owner {
              address
            }
          }
        }
        contents {
          type {
            layout
          }
          json
        }
      }
    }
  }
}
}
    `,
    variables: {
      addr
    }
  })).data as PasswordNodeObject;

  const passwordList = await Promise.all(data.address.objects.edges
    .filter(edge => 
      edge.node.contents.json.website?.includes(pageOrigin)
    )
    .map(edge => ({
      id: edge.node.contents.json.id,
      iv: edge.node.contents.json.iv,
      pw: edge.node.contents.json.pw,
      username: edge.node.contents.json.username,
      salt: edge.node.contents.json.salt,
      website: edge.node.contents.json.website
    }))
    .map(async pdobj => ({
      ...pdobj,
      pw: await aesDecrypt(pdobj.pw, pdobj.iv, pdobj.salt, mk)
    }))) as PasswordObject[];

  return passwordList;
}