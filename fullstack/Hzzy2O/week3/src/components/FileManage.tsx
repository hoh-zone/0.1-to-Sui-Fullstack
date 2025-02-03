import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { Container, Heading, Select } from "@radix-ui/themes";
import { client, networkConfig, suiGraphQLClient } from "../networkConfig";
import { useEffect, useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "./FileManage.css";
import { addCoinToolderTx, createFolderTx, addNftToFolderTx } from "../contract";
import * as Form from "@radix-ui/react-form";
import queryFolderDataContext from "../ql";

const DialogForm = (props: {profileId: string}) => {
  const [open, setOpen] = useState(false);
  const { mutate: signAndExecuteTransaction, isPending } = useSignAndExecuteTransaction();
  function handleCreateFolder(data: any) {
    
    const tx = createFolderTx(data.name, data.description, props.profileId)
    signAndExecuteTransaction({
        transaction: tx,
      }, {
        onSuccess: () => {
          window.alert("Folder created successfully!");
          setOpen(false)
        },
        onError: (err) => {
          console.error(err);
        }
      }
    )
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="Button violet">Add Folder</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">add folder</Dialog.Title>
          <Form.Root 
						onSubmit={(event) => {
              const data = Object.fromEntries(new FormData(event.currentTarget))
              handleCreateFolder(data)
							event.preventDefault();
						}}
					>
            <Form.Field className="FormField" name="name">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel Label">name</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Please enter folder name
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="text" required />
              </Form.Control>
            </Form.Field>
            <Form.Field className="FormField" name="description">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel Label">description</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Please enter folder description
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="text" required />
              </Form.Control>
            </Form.Field>
            <div
              style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}
            >
              {
                isPending ? <button className="Button" disabled>creating...</button> : <button type="submit" className="Button green">create</button>
              }
              
            </div>
          </Form.Root>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

const DialogList = (props: {coins: any[], folder:any}) => {
  const [open, setOpen] = useState(false);
  const { mutate: signAndExecuteTransaction, isPending } = useSignAndExecuteTransaction();
  function handleAdd(data: any) {
    const tx = addCoinToolderTx(props.folder.id.id, data.objectId, data.coinType, data.originBalance)
    // const tx = createFolderTx(data.name, data.description, props.profileId)
    signAndExecuteTransaction({
        transaction: tx,
      }, {
        onSuccess: () => {
          window.alert("add to folder successfully!");
          setOpen(false)
        },
        onError: (err) => {
          console.error(err);
        }
      }
    )
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="Button violet">Add Coin To Folder</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">add folder</Dialog.Title>
          <div>
            {props.coins.map((coin) => (
              <div key={coin.objectId} className="Label">
                <div>
                  <span>{coin.symbol}</span>
                  <span>(balance: {coin.balance})</span>
                </div>
                <button className="Button" onClick={() => handleAdd(coin)}>add to folder</button>
              </div>))
             }
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

// 添加 NFT Dialog 组件
const DialogNftList = (props: {nfts: any[], folder:any}) => {
  const [open, setOpen] = useState(false);
  const { mutate: signAndExecuteTransaction, isPending } = useSignAndExecuteTransaction();
  
  function handleAddNft(nft: any) {
    const tx = addNftToFolderTx(props.folder.id.id, nft.objectId, nft.type)
    signAndExecuteTransaction({
        transaction: tx,
      }, {
        onSuccess: () => {
          window.alert("NFT added to folder successfully!");
          setOpen(false)
        },
        onError: (err) => {
          console.error(err);
        }
      }
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="Button violet">Add NFT To Folder</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Add NFT</Dialog.Title>
          <div>
            {props.nfts.map((nft) => (
              <div key={nft.id} className="Label">
                <div>
                  <span>{nft.name}</span>
                </div>
                <button className="Button" onClick={() => handleAddNft(nft)}>add to folder</button>
              </div>))
             }
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

// 在 FileManage 组件中添加 NFT 相关代码
export default function FileManage(props: { profileId: string, coins: any[], nfts: any[]}) {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [coinBalances, setCoinBalances] = useState<CoinBalance[]>([]);
  const [folderData, setFolderData] = useState<any[]>([]);

  // 查询文件夹创建事件
  const { data: folderEvents, refetch } = useSuiClientQuery(
    'queryEvents',
    {
      query: {
        MoveEventType: `${networkConfig.testnet.packageId}::profile::FolderCreated`,
      }
    },
  );

  // 查询代币包装事件
  const { data: coinEvents } = useSuiClientQuery(
    'queryEvents',
    {
      query: {
        MoveEventType: `${networkConfig.testnet.packageId}::profile::CoinWrapped`,
      }
    },
  );

  // 获取文件夹详情
  const getFolderDetails = async (folderId: string) => {
    try {
      const { data } = await client.getObject({
        id: folderId,
        options: { showContent: true }
      });
      if (data?.content) {
        const fields = (data.content as any)?.fields;
        return fields;
      }
    } catch (error) {
      console.error('Error fetching folder:', error);
    }
  };

  const getFolders = async (json: any) => {
    try {
      const list = await Promise.all(
        json.map((item: any) => getFolderDetails(item.id))
      )
      setFolders(list)
      setSelectedFolder(list[0].id)
    } catch (error) {
      console.error('Error fetching folder:', error);
    }
  };

  useEffect(() => {
    if (folderEvents && account) {
      const list = folderEvents.data.filter((item) => (item.parsedJson as any).owner === account.address).map(item => item.parsedJson)
      if (list) {
        getFolders(list)
      }
    }

  }, [account, folderEvents])
  
  const queryFolderDataByGraphQL = async (folder: string) => {
    const result = await suiGraphQLClient.query({
        query: queryFolderDataContext,
        variables: {
            address: folder
        }
    })
    const data: any[] = result.data?.object?.dynamicFields?.nodes?.map((node) => {
          const nameJson = node.name as { json: { name: string } };
          const valueJson = node.value as { json: { value: string } }; // Changed unknown to string to match FolderData type
          return {
              name: nameJson.json.name.split(':')[2],
              value: valueJson.json.value
          }
      }) ?? [];
    setFolderData(data)
  }
  useEffect(() => {
    if (selectedFolder) {
       queryFolderDataByGraphQL(selectedFolder.id)
    }

  }, [selectedFolder])

  // 添加 NFT 事件查询
  const { data: nftEvents } = useSuiClientQuery(
    'queryEvents',
    {
      query: {
        MoveEventType: `${networkConfig.testnet.packageId}::profile::NftWrapped`,
      }
    },
  );

  return (
    <Container my="2">
      <Heading mb="2">Your Folder</Heading>

      <DialogForm profileId={props.profileId}/>

      {/* 文件夹选择器 */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Select.Root value={selectedFolder} onValueChange={setSelectedFolder}>
          <Select.Trigger />
          <Select.Content>
            {folders.map((folder) => (
              <Select.Item key={folder.id} value={folder.id}>
                {folder.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      <DialogList coins={props.coins} folder={folders.find((f) => f.id === selectedFolder)}/>
      <DialogNftList nfts={props.nfts} folder={folders.find((f) => f.id === selectedFolder)}/>

      {/* 显示选中文件夹中的代币 */}
      {selectedFolder && (
        <div style={{ marginTop: 20 }}>
          <Heading size="4">Coins in folder</Heading>
          {
            folderData.length ? 
            folderData.map((coin, index) => (
              <div key={index}>
                {coin.name}: {coin.value}
              </div>
            )) :
            <div>No coins in folder</div>
          }
        </div>
      )}
    </Container>
  );
}
