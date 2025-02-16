import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  queryFolderData,
  queryFolderDataByGraphQL,
  queryProfile,
  queryState,
} from "@/constract";
import { useToast } from "@/hooks/use-toast";
import { getCoinAndNftList, getFolderList } from "@/hooks/useGetInfo";
import { networkConfig, suiClient } from "@/networkConfig";
import {
  IAssets,
  ICoin,
  IContent,
  IFolder,
  IFolderData,
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
import { useNavigate } from "react-router-dom";
import { z } from "zod";

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
  const [folderData, setFolderData] = useState<IFolderData[]>([]);
  const navigate = useNavigate();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { toast } = useToast();
  // 监听 请求
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
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
      (item) => item.owner === currentUser?.address,
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
          }),
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
      module: "week_two",
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
      },
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
        item.objectId === id ? { ...item, splitCoinAmount: value } : item,
      ),
    );
  };
  const selectChange = async (value: string) => {
    const folder = folderList.find((item) => {
      return item.id.id === value;
    });
    setSelectedFolder(folder);

    const result = await queryFolderDataByGraphQL(value);
    console.log("result", result);
    setFolderData([...result]);
  };
  // 向folder中添加coin
  const addCoinToFolder = (item: ICoin) => {
    console.log(item);
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
      module: "week_two",
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
      },
    );
  };
  const showFolderData = () => {};

  const dataDialog = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="ml-2" onClick={showFolderData}>
            check folder data
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-full w-auto h-auto"
        >
          <DialogHeader className="">
            <DialogTitle>Folder Data</DialogTitle>
          </DialogHeader>
          <div>
            <div className="h-10 flex justify-between items-center bg-gray-100">
              <div className="flex-1">objectID</div>
              <div className="ml-10">value</div>
            </div>
            {folderData.map((item) => {
              return (
                <div
                  key={item.name}
                  className="h-10 flex justify-between items-center overflow-hidden"
                >
                  <div className="flex-1">{item.name}</div>
                  <div className="ml-10">{item.value}</div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
                      <Button className="w-full">Add to Folder</Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/3 border-2 border-gray-200 p-4 rounded-md ml-5">
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
            {folderData.length > 0 && dataDialog()}
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
      </div>
      {/* Toast组件 用于提示 */}
      <Toaster />
    </>
  );
}

export default User;
