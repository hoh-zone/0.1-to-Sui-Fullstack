"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import {
  queryCoinMetadata,
  queryFolderDataByGraphQL,
  queryNFTType,
  queryProfile,
  queryState,
} from "@/constract";
import { useToast } from "@/hooks/use-toast";
import { getCoinAndNftList, getFolderList } from "@/hooks/useGetInfo";
import { networkConfig, suiClient } from "../../utils/networkConfig";
import {
  IAssets,
  ICoin,
  IContent,
  IFolder,
  IFolderData,
  ISubFolderData,
  ISuiParseData,
} from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { CoinMetadata, SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { redirect } from "next/navigation";

function User() {
  // 当前链接钱包
  const currentUser = useCurrentAccount();
  // currentUser profile内容
  const [currentUserProfile, setCurrentUserProfile] = useState<IContent>();
  // 存放Coin和NFT
  const [coinList, setCoinList] = useState<SuiObjectData[]>([]);
  const [nftList, setNftList] = useState<SuiObjectData[]>([]);
  // 存放Folder
  const [folderList, setFolderList] = useState<IFolder[]>([]);
  // 存放选中folder
  const [selectFolder, setSelectedFolder] = useState<IFolder>();
  // 存放选中folder中的data
  const [folderData, setFolderData] = useState<IFolderData>();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { toast } = useToast();
  // 监听 请求
  useEffect(() => {
    if (!currentUser) {
      redirect("/");
    } else {
      fetchData();
    }
  }, [currentUser]);
  // 当currentUser变化时，执行fetchData中的数据查询
  const fetchData = async () => {
    // 查询所有的profile
    const state = await queryState();
    // 如果profile Array中有当前链接钱包的地址，获取ID
    const currentUserProfileID = state.find(
      (item) => item.owner === currentUser?.address
    )?.profile;
    // 如果有ID,获取链接钱包地址的profile具体内容,如果没有就要用户先填写
    if (currentUserProfileID) {
      // 获取当前钱包发送的profile内容
      const profile = await queryProfile(currentUserProfileID);
      setCurrentUserProfile(profile);
      const assets = (await getCoinAndNftList(currentUser!.address)) as IAssets;
      if (assets.coinArr && assets.coinArr.length > 0) {
        const updatedCoins = await Promise.all(
          assets.coinArr.map(async (coin) => {
            const coinMetadata = await queryCoinMetadata(coin.type as string);
            return {
              ...coin,
              coinMetadata: coinMetadata || undefined,
              splitCoinAmount: 0,
            };
          })
        );
        assets.coinArr = updatedCoins;
      }
      setCoinList(assets.coinArr);
      setNftList(assets.nftArr);
      const folders = await getFolderList(profile.folders);
      setFolderList([...folders]);
    }
  };

  // 1. Define your form.
  const formSchema = z.object({
    name: z.string().min(1),
    desc: z.string().min(1),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });
  // 创建新的folder
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tx = new Transaction();
    tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "week4",
      function: "create_folder",
      arguments: [
        tx.pure.string(values.name),
        tx.pure.string(values.desc),
        tx.object((currentUserProfile as IContent).id.id),
      ],
    });
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (res) => {
          if (res.digest) {
            const result = await suiClient.waitForTransaction({
              digest: res.digest,
              options: { showEffects: true, showEvents: true },
            });
            if (result.effects?.status.status === "success") {
              fetchData();
            }
          }
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

  const getBalance = (item: ICoin) => {
    const fields = (item.content as ISuiParseData).fields;
    const balance = (
      fields.balance /
      10 ** (item.coinMetadata as CoinMetadata).decimals
    ).toFixed(item.coinMetadata?.decimals);

    return balance;
  };
  const getAmount = (value: string, id: string) => {
    setCoinList((coinList) =>
      coinList.map((item) =>
        item.objectId === id ? { ...item, splitCoinAmount: value } : item
      )
    );
  };
  const selectChange = async (value: string) => {
    const folder = folderList.find((item) => {
      return item.id.id === value;
    });
    setSelectedFolder(folder);

    const result = await queryFolderDataByGraphQL(value);
    console.log("result", result);
    setFolderData(result);
  };
  // 向folder中添加nft
  const addNFTToFolder = (item: SuiObjectData) => {
    console.log("item", item);
    console.log(selectFolder);
    // 是否选择了folder
    if (!selectFolder) {
      toast({
        variant: "default",
        title: "提示",
        description: "请选择一个Folder",
      });
      return;
    }

    const tx = new Transaction();

    tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "week4",
      function: "add_nft_to_folder",
      arguments: [tx.object(selectFolder.id.id), tx.object(item.objectId)],
      typeArguments: [item.type as string],
    });
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (res) => {
          if (res.digest) {
            const result = await suiClient.waitForTransaction({
              digest: res.digest,
              options: { showEffects: true, showEvents: true },
            });
            if (result.effects?.status.status === "success") {
              fetchData();
              toast({
                title: "Tip",
                description: "add to folder success",
              });
            }
          }
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };
  // 向folder中添加coin
  const addCoinToFolder = (item: ICoin) => {
    console.log(item);
    // 是否选择了folder
    if (!selectFolder) {
      toast({
        variant: "default",
        title: "提示",
        description: "请选择一个Folder",
      });
      return;
    }
    if (
      item.splitCoinAmount &&
      item.content &&
      (item.content as ISuiParseData).fields.balance &&
      item.splitCoinAmount > (item.content as ISuiParseData).fields.balance
    ) {
      toast({
        title: "提示",
        description: "Coin余额不足",
      });
      return;
    }
    const tx = new Transaction();
    // const coinAmount = (item.splitCoinAmount as number) * 10 ** (item.coinMetadata?.decimals || 0);
    const [depositCoin] = tx.splitCoins(tx.object(item.objectId), [
      tx.pure.u64(item.splitCoinAmount as number),
    ]);
    tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "week4",
      function: "add_coin_to_folder",
      arguments: [tx.object(selectFolder.id.id), depositCoin],
      typeArguments: [item.type as string],
    });
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (res) => {
          if (res.digest) {
            const result = await suiClient.waitForTransaction({
              digest: res.digest,
              options: { showEffects: true, showEvents: true },
            });
            if (result.effects?.status.status === "success") {
              fetchData();
              toast({
                title: "Tip",
                description: "add to folder success",
              });
            }
          }
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };
  // 从folder中移除coin
  const removeCoinFromFolder = (coinType: string) => {
    console.log("folderID", selectFolder!.id.id);
    console.log("coinType", coinType);
    console.log("account", currentUser!.address)
    const folderID = selectFolder!.id.id
    const tx = new Transaction();
    const [coin] = tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "week4",
      function: "remove_coin_from_folder",
      arguments: [tx.object(folderID)],
      typeArguments: [coinType],
    });
    tx.transferObjects([coin], currentUser!.address);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (res) => {
          if (res.digest) {
            const result = await suiClient.waitForTransaction({
              digest: res.digest,
              options: { showEffects: true, showEvents: true },
            });
            if (result.effects?.status.status === "success") {
              fetchData();
              toast({
                title: "Tip",
                description: "remove coin from folder success",
              });
            }
          }
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };
  // 从folder中移除nft
  const removeNFTFromFolder = async (item: ISubFolderData) => {
    // 获取nft type
    const nftType = await queryNFTType(item.name)
    const folderID = selectFolder!.id.id
    const tx = new Transaction();
    const [nft] = tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "week4",
      function: "remove_nft_from_folder",
      arguments: [tx.object(folderID),tx.pure.address(item.name)],
      typeArguments: [nftType],
    });
    tx.transferObjects([nft], currentUser!.address);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (res) => {
          if (res.digest) {
            const result = await suiClient.waitForTransaction({
              digest: res.digest,
              options: { showEffects: true, showEvents: true },
            });
            if (result.effects?.status.status === "success") {
              fetchData();
              toast({
                title: "Tip",
                description: "remove nft from folder success",
              });
            }
          }
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  }

  return (
    <>
      <Header></Header>
      <div className="container mx-auto flex justify-between items-start mt-5">
        <div className="w-2/3 p-3">
          <Tabs defaultValue="coin" className="w-full">
            <TabsList>
              <TabsTrigger value="coin">Coin</TabsTrigger>
              <TabsTrigger value="nft">NFT</TabsTrigger>
            </TabsList>
            <TabsContent value="coin">
              {coinList.map((item: ICoin) => {
                return (
                  <div
                    key={item.objectId}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-md mb-5"
                  >
                    <div className="flex-auto overflow-hidden">
                      <div className="font-bold">Object ID:{item.objectId}</div>
                      <div>Type: {item.type}</div>
                      <div className="text-blue-500">
                        Balance: {getBalance(item)}
                      </div>
                    </div>
                    <div className=" ml-3 mr-3">
                      <Input
                        className="w-[80px]"
                        value={item.splitCoinAmount}
                        type="number"
                        min={0}
                        onChange={(e) => {
                          getAmount(e.target.value, item.objectId);
                        }}
                      />
                    </div>
                    <div className="w-[120px]">
                      <Button
                        className="w-full"
                        onClick={() => addCoinToFolder(item)}
                      >
                        Add to Folder
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
            <TabsContent value="nft">
              {nftList.map((item: SuiObjectData) => {
                return (
                  <div
                    key={item.objectId}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-md mb-5"
                  >
                    <div className="flex-auto overflow-hidden">
                      <div className="font-bold">Object ID:{item.objectId}</div>
                      <div>Type: {item.type}</div>
                    </div>
                    <div className="w-[120px]">
                      <Button
                        className="w-full"
                        onClick={() => addNFTToFolder(item)}
                      >
                        Add to Folder
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/3 ml-5">
          <div className="w-full border-2 border-gray-200 p-4 rounded-md">
            <div className="font-bold text-xl text-center">Folder Manage</div>
            <div className="w-full mt-5 mb-5 flex justify-between items-center">
              <Select onValueChange={selectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  {folderList.map((item) => {
                    return (
                      <SelectItem key={item.id.id} value={item.id.id}>
                        {item.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <>
                      <FormItem className="mt-5">
                        <FormLabel>Folder Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter folder name"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <>
                      <FormItem className="mt-5">
                        <FormLabel>Folder Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter folder description"
                            autoComplete="off"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </>
                  )}
                />
                <Button type="submit" className="w-full mt-10">
                  Create Manage
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-3">
            <div className="font-bold">Coin Data</div>
            {folderData?.coin.map((item) => {
              return (
                <div key={item.name} className="w-full mb-3">
                  <p className="overflow-hidden text-wrap">
                    Object:{item.name}
                  </p>
                  <p>value:{item.value}</p>
                  <Button size="sm" onClick={() => removeCoinFromFolder(item.name)}>
                    remove
                  </Button>
                </div>
              );
            })}
            <div className="font-bold">NFT Data</div>
            {folderData?.nft.map((item) => {
              return (
                <div key={item.name} className="mb-3">
                  <p className="w-full overflow-hidden">Object:{item.name}</p>
                  <Button size="sm" onClick={() => removeNFTFromFolder(item)}>remove</Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Toast组件 用于提示 */}
      <Toaster />
    </>
  );
}

export default User;
