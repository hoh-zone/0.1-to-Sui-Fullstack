import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import {DataTable} from './DataTable'
import { useState,useEffect } from "react";
import {queryProfile,createProfileTx,removeProfileTx} from './lib/contracts/index';
import { Profile } from "./lib/contracts/Profile";
import { useSignAndExecuteTransaction ,useAccounts,useSuiClient,useCurrentAccount} from "@mysten/dapp-kit";
import { config } from "@/networkConfig";
import {Button} from "@/components/ui/button"
import tokens from "../images/tokens.jpg"

function App() {
  let [name,setName ] = useState<string>("");
  let [desc,setDesc] = useState<string>("")
  let [profiles,setProfiles] = useState<Profile[]>([])
  const { mutate: signAndExecuteTransaction }  = useSignAndExecuteTransaction();
  let accounts = useAccounts();
  let suiClient = useSuiClient();
  let curr_address = useCurrentAccount()?.address
  useEffect(()=>{
    queryProfile(suiClient).then(setProfiles)
  },[curr_address,accounts])

  function getOwnerName(addr:string){
    let account = accounts.find(item=>item.address === addr)
    return account ?  account.label : addr;
  }

  let removePofile = (id:string)=>{
    let tx = removeProfileTx(id,config.state)
    
    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: 'sui:testnet',
      },
      {
        onSuccess: (result) => {
          console.log("remove Profile:executed transaction", result);
          queryProfile(suiClient).then(setProfiles)
          
        },
        onError:(error) =>{
          console.log("remove Profile:error:",error);
        }
      },
    );
  }
  let createPofile = ()=>{
    let tx = createProfileTx(name,desc,config.state)
    
    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: 'sui:testnet',
      },
      {
        onSuccess: (result) => {
          console.log('create Profile:executed transaction', result);
          queryProfile(suiClient).then(setProfiles)
          
        },
        onError:(error) =>{
          console.log("create Profile:error:",error);
        }
      },
    );
  }
  return (
    <>
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-26 items-center justify-between">
            {/* Logo 部分 */}
            <div className="flex items-center">
              <img className="h-24 w-24" src={tokens} ></img>
            </div>
            
            {/* 按钮部分 */}
            <div className="flex items-center space-x-4" >
              <ConnectButton />
            </div>            

          </div>
          
        </div>
      </header>
      <div className="container mx-auto px-4 mt-8">
        <div className="flex ">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Profile Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="请输入名称"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="flex block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              value={desc}
              onChange={(e)=>setDesc(e.target.value)}
              name="description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="请输入描述"
            />
          </div>

        </div>
        <div>
          <Button
            type="button"
            className="ustify-center rounded-md border  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={createPofile}
          >
            Add Profile
          </Button>
        </div>

      </div>
      <DataTable profiles={profiles} ownerName={getOwnerName} account={curr_address} remove={removePofile}>

      </DataTable>
    </>
  );
}

export default App;
