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
import { queryProfile, queryState } from "@/constract";
import { getCoinAndNftList, getFolderList } from "@/hooks/useGetInfo";
import { networkConfig, suiClient } from "@/networkConfig";
import { IAssets, IContent, IFolder } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { SuiObjectData, SuiParsedData } from "@mysten/sui/client";
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
  const navigate = useNavigate();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
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
          if(res.digest) {
            const result = await suiClient.waitForTransaction({
              digest: res.digest,
              options: { showEffects: true, showEvents: true }
            });
            if(result.effects?.status.status === 'success') {
              fetchData()
            }
          }
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );
  };
  const getBalance = (item: SuiObjectData) => {
    const fields = (item.content as SuiParsedData).fields;
    const balance = fields.balance;
    return balance;
  };
  const selectChange = (value: string) => {
    console.log(value)
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
              {coinList.map((item: SuiObjectData) => {
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
                      <Input className="w-[80px]" type="number" min={0} />
                    </div>
                    <div className="w-[120px]">
                      <Button className="w-full">Add to Folder</Button>
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
          <div className="w-full mt-5 mb-5">
            <Select onValueChange={selectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folderList.map((item) => {
                  return (
                    <SelectItem key={item.id.id} value={item.name}>
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
      </div>
    </>
  );
}

export default User;
