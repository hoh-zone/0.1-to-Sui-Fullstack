import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { AccountInfo } from './back/0xPasswordUtil';
import { useEffect, useState, useRef } from 'react';
import { Flex, Text, Button, TextField } from "@radix-ui/themes";
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

const configSalt = "0xpassword";

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}
type PasswordObject = {
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

export function OwnedObjects() {

  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [cryptoKey, setCryptoKey] = useState("");
  const [walletId, setWalletId] = useState("");
  const [passwordData, setPasswordData] = useState<Array<PasswordObject>>([]); // 新增状态存储密码数据
  const [pageOrigin, setPageOrigin] = useState(window.location.origin);
  const pageOriginRef = useRef(pageOrigin);

  useEffect(() => {
    pageOriginRef.current = pageOrigin;
  }, [pageOrigin]);

  useEffect(() => {
    // 处理扩展页面获取真实页面源
    if (window.location.protocol === 'chrome-extension:') {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        console.log(tabs);
        // 添加错误处理
        if (chrome.runtime.lastError) {
          console.error('Tab查询错误:', chrome.runtime.lastError);
          return;
        }
        
        chrome.tabs.sendMessage(
          tabs[0]?.id!, 
          {type: 'GET_PAGE_ORIGIN'}, 
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('消息发送失败:', chrome.runtime.lastError);
              return;
            }
            setPageOrigin(response?.origin || window.location.origin);
          }
        );
      });
    }
  }, []); // 空依赖数组表示只在挂载时执行

  const sendGetSelectedAccount = () => {
    console.log("GET_SELECTED_ACCOUNT send", account);
    sendMessageToBackground({
      type: "GET_SELECTED_ACCOUNT",
      data: {}
    });
  }
  const sendConfigUpdate = (cryptoKey: string, walletId : string) => {
    console.log("sendConfigUpdate send", walletId);
    sendMessageToBackground({
      type: "CONFIG_UPDATE",
      data: {
        key: cryptoKey,
        id: walletId
      }
    });
  };
  // 使用 chrome.runtime.id 获取当前扩展的ID
  const sendMessageToBackground = (message: any) => {
    window.chrome.runtime.sendMessage(
      window.chrome.runtime.id,
      message,
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('通信错误:', chrome.runtime.lastError);
        } else {
          console.log('收到响应:', response);
          if(response.type === "GET_SELECTED_ACCOUNT_RESPONSE"){
            if(response.code === 0){
              localStorage.setItem("SELECTED_ACCOUNT", JSON.stringify(response.data));
              setAccount(response.data);
            }else {
              sendGetSelectedAccount();
            }
          }
        }
      }
    );
  };


  async function getPasswordObjects(suiGraphQLClient: SuiGraphQLClient, addr: string): Promise<PasswordNodeObject> {
    return (await suiGraphQLClient.query({
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
  }

  const suiGraphQLClient = new SuiGraphQLClient({
    url: import.meta.env.VITE_SUI_GRAPHQL_URL || "https://sui-testnet.mystenlabs.com/",
  })

  useEffect(() => {
    if (account?.address) { // 当account存在且有address时执行
      getPasswordObjects(suiGraphQLClient, account.address)
        .then((data) => {
          console.log("getPasswordObjects", data);
          console.log('getPasswordObjects 页面源:', pageOriginRef.current);
          const passwordList = data.address.objects.edges
            .filter(edge => 
              edge.node.contents.json.website?.includes(pageOriginRef.current) // 过滤包含当前源的记录
            )
            .map(edge => ({
              id: edge.node.contents.json.id,
              iv: edge.node.contents.json.iv,
              pw: edge.node.contents.json.pw,
              username: edge.node.contents.json.username,
              salt: edge.node.contents.json.salt,
              website: edge.node.contents.json.website
            })) as PasswordObject[];
          
          console.log("转换后的密码数据:", passwordList);
          setPasswordData(passwordList);
        })
        .catch(error => {
          console.error("获取密码数据失败:", error);
        });
    }
  }, [account, pageOrigin]); // 添加account作为依赖项

  // 在组件中调用
  useEffect(() => {
    sendGetSelectedAccount();
    const savedConfig = localStorage.getItem("WALLET_CONFIG");
    if (savedConfig) {
      try {
        const bytes = AES.decrypt(savedConfig, configSalt)
        const { key, id } = JSON.parse(bytes.toString(encUtf8));
        console.log("cryptoKey", key)
        setCryptoKey(key || "");
        setWalletId(id || "");
        sendConfigUpdate(key, id);
      } catch (e) {
        console.error("配置解密失败");
      }
    }
    const savedAccount = localStorage.getItem("SELECTED_ACCOUNT");
    if(savedAccount){
       let savedAcc = JSON.parse(savedAccount) as AccountInfo;
       setAccount(savedAcc);
    }

  }, []);

  // 保存配置
  const saveConfig = () => {
    console.log("cryptoKey", cryptoKey)
    const encrypted = AES.encrypt(
      JSON.stringify({ key: cryptoKey, id: walletId }),
      configSalt
    ).toString();
    localStorage.setItem("WALLET_CONFIG", encrypted);
    sendConfigUpdate(cryptoKey, walletId);    
    setEditMode(false);
  };

  // 渲染配置界面
  if (!cryptoKey || !walletId || editMode) {
    return (
      <Flex direction="column" gap="4" style={{ width: '100%' }}>
        <Flex direction="column" gap="2" style={{ width: '100%' }}>
          {account ? (
            <Text>当前已选择账户: {account.address}</Text>
          ) : (
            <Text color="gray">当前未选择账户</Text>
          )}
        </Flex>
        <Flex direction="column" gap="2" style={{ width: '100%' }}>
          <Text>修改配置: </Text>
          <Flex gap="3" align="center">
            <Text style={{ width: '100px' }}>加密密钥：</Text>
            <TextField.Root 
              type='password' 
              size="2" 
              placeholder="加密密钥" 
              value={cryptoKey} 
              onChange={(e) => setCryptoKey(e.target.value)}
              style={{ flex: 1 }}
            />
          </Flex>
          <Flex gap="3" align="center">
            <Text style={{ width: '100px' }}>钱包插件ID：</Text>
            <TextField.Root 
              size="2" 
              placeholder="钱包插件ID" 
              value={walletId} 
              onChange={(e) => setWalletId(e.target.value)}
              style={{ flex: 1 }}
            />
          </Flex>
          <Button onClick={saveConfig}>保存配置</Button>
        </Flex>
        <Flex direction="column" gap="2" style={{ width: '100%' }}>
          <Text>当前网站已保存数据：</Text>
          <Flex direction="column" gap="1" style={{
            border: '1px solid var(--gray-5)',
            borderRadius: 'var(--radius-2)',
            padding: 'var(--space-2)',
            fontSize: 'var(--font-size-1)'
          }}>
            {/* 简化表头 */}
            <Flex gap="3" style={{ fontWeight: '500', color: 'var(--gray-11)' }}>
              <Text style={{ flex: 2 }}>用户名</Text>
              <Text style={{ flex: 1 }}>密码</Text>
            </Flex>

            {/* 示例数据行 */}
            <Flex gap="3" align="center" style={{ padding: 'var(--space-2) 0' }}>
              <Text style={{ flex: 2 }}>user123</Text>
              <Text style={{ flex: 1 }}>*******</Text>
            </Flex>

            {/* 分隔线示例行 */}
            <Flex gap="3" align="center" style={{
              padding: 'var(--space-2) 0',
              borderTop: '1px solid var(--gray-4)'
            }}>
              <Text style={{ flex: 2 }}>admin</Text>
              <Text style={{ flex: 1 }}>*******</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  console.log("account", account);
  // 显示已保存的配置
  return (<Flex direction="column" gap="4" style={{ width: '100%' }}>
    <Flex direction="column" gap="2" style={{ width: '100%' }}>
      {account ? (
        <Text>当前已选择账户: {account.address}</Text>
      ) : (
        <Text color="gray">当前未选择账户</Text>
      )}
    </Flex>
    <Flex direction="column" gap="2" style={{ width: '100%' }}>
      <Text>当前配置: </Text>
      <Text>加密密钥: {cryptoKey.slice(0, 3)}******</Text>
      <Text>钱包插件ID: {walletId}</Text>
      <Button onClick={() => setEditMode(true)}>修改配置</Button>
    </Flex>
    <Flex direction="column" gap="2" style={{ width: '100%' }}>
      <Text>当前网站已保存数据：</Text>
      <Flex direction="column" gap="1" style={{
        border: '1px solid var(--gray-5)',
        borderRadius: 'var(--radius-2)',
        padding: 'var(--space-2)',
        fontSize: 'var(--font-size-1)'
      }}>
        {/* 简化表头 */}
        <Flex gap="3" style={{ fontWeight: '500', color: 'var(--gray-11)' }}>
          <Text style={{ flex: 2 }}>用户名</Text>
          <Text style={{ flex: 1 }}>密码</Text>
        </Flex>

        {/* 示例数据行 */}
        {passwordData?.map((item) => (
          <Flex 
            key={item.id}
            gap="3" 
            align="center" 
            style={{
              padding: 'var(--space-2) 0',
              borderTop: '1px solid var(--gray-4)'
            }}
          >
            <Text style={{ flex: 2 }}>{item.username}</Text>
            <Text style={{ flex: 1 }}>{item.pw.replace(/./g, '*')}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  </Flex>
  );
}


