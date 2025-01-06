import { queryOptions } from "@tanstack/react-query"
import { config } from "../../networkConfig"
import { Transaction } from "@mysten/sui/transactions";
import { Profile,State,Struct,Table,Field,Address} from './Profile'
import { MoveStruct,Signature, SuiClient, SuiObjectResponse} from '@mysten/sui/client'

import { ThemeContext } from "@radix-ui/themes";
import {PaginatedEvents} from "@mysten/sui/client"
import { sign } from "crypto";
import {ProfileCreated} from './Profile'
import {createProfileTx} from './index'
import {signer} from './local_key'

//用于本地测试数据获取接口,使用nodejs
function testCreate(suiClient: SuiClient,){
    let tx = createProfileTx("ljl3","desc3",config.state);
    //如果设置这个参数,会调用 getClient(options).dryRunTransactionBlock , 调用的合约内部存在分支,无法估算开销
    tx.setGasBudget(3000000);
    console.log("signer address:",signer.toSuiAddress());
    let f = async()=>{
        let sign_resp = await suiClient.signAndExecuteTransaction({transaction:tx,signer});
            
        let resp = await suiClient.waitForTransaction({digest:sign_resp.digest,options:{showEffects:true,showBalanceChanges:true,showEvents:true}});

        ///console.log(resp);
        if(resp.effects){
            if(resp.effects.status.status == 'success'){            
                if(resp.events){
                    console.log("events :",resp.events)
                }
            } else{
                console.log("tx.digest:",sign_resp.digest,",tx error:",resp.effects.status.error);
            }
        }
    }
    f();
}
