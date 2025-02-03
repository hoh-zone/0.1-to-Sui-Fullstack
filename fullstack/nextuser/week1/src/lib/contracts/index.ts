import { queryOptions } from "@tanstack/react-query"
import { config } from "../../networkConfig"
import { Transaction } from "@mysten/sui/transactions";
import { Profile,State,Struct,Table,Field,Address} from './Profile'
import { MoveStruct,Signature, SuiClient, SuiObjectResponse} from '@mysten/sui/client'
import { ThemeContext } from "@radix-ui/themes";
import {PaginatedEvents} from "@mysten/sui/client"
import { sign } from "crypto";
import {ProfileCreated} from './Profile'
//用来测试获取一个Table 内部数据的代码
async function showTableValues(suiClient: SuiClient,table :Table){
    let id = table.id.id;
    let size = Number(table.size);
    let cursor = null;
    console.log("show values:",id);
    let ret = await suiClient.getDynamicFields({parentId:id,cursor,limit:50})
    do{
        for(let i  = 0; i < ret.data.length; ++ i){
            let e = ret.data[i];
            console.log("dynamic field:",e);
            console.log("table data name(type,value) value(type,id),e:",e.name.type,e.name.value ,  e.objectType,e.objectId);
            let obj = await suiClient.getDynamicFieldObject({parentId:id,name:e.name});
            console.log("dynamic field object:",obj);
            if(obj.data?.content?.dataType=="moveObject"){
                let u = obj.data.content.fields as unknown 
                let s  = u as Field<Address,Address>;
                let a = [s.name,s.value];
                console.log("field name,value",a );

                let ret = await suiClient.getObject({id : s.value, options:{showContent:true}});
                let profile = ret.data?.content as unknown as Struct<Profile>
                console.log("profile object:",profile,profile.fields.description);
            } 
            
        }
        
        ret = await suiClient.getDynamicFields({parentId:id,cursor,limit:50})
        cursor = ret.nextCursor;
    }while(ret.hasNextPage)

}

//查询state对象的函数
export const queryState= async (suiClient: SuiClient,stateID:string)=>{
    const result = await suiClient.getObject({
        id : stateID,
        options:{
            showContent:true
        }
    })
    
    let parseData = result?.data?.content! ;
    if(parseData.dataType == 'moveObject'){
        let s = parseData.fields as unknown as State  
        console.log("table id:", s.users.fields.id.id)
        showTableValues(suiClient,s.users.fields);

        return s;
    } else{
        return null;
    }
   
} 

export const createProfileTx = (name:string, 
                                desc : string, 
                                stateID:string) =>{
        const tx = new Transaction();
        tx.moveCall({arguments:[tx.pure.string(name),tx.pure.string(desc),tx.object(config.state)],
                     package:config.pkg, 
                     module:"week_one_alt", 
                     function:"create_profile"})
        //必须设置budget,因为合约create_profile内部会asset, 导致客户端无法估算gas值
        tx.setGasBudget(1e7)
        return tx;
}

export const removeProfileTx = (id:string,
    stateID:string) =>{
    const tx = new Transaction();
    tx.moveCall({arguments:[tx.object(config.state),tx.object(id)],
    package:config.pkg, 
    module:"week_one_alt", 
    function:"remove_profile"})
    //必须设置budget,因为合约create_profile内部会asset, 导致客户端无法估算gas值
    tx.setGasBudget(1e7)
return tx;
}

function testQueryState(suiClient: SuiClient,){

    queryState(suiClient,config.state).then((state:State)=>console.log(state.id.id,state.users))
}

//由于 返回的event里面的地址是32字节补齐的,前面有0x00 在其他地方可能会被省略, 所以提供补齐地址功能
const FILL_STR  = '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
const ADDR_STR_LEN  = 66;//32bytes 对应64个字符 再加上0x
function get_full_addr(addr :string){
    let fillLen = ADDR_STR_LEN - addr.length;
    console.log("fill len:"+fillLen)
    return addr.slice(0,2) + FILL_STR.slice(0,fillLen) + addr.slice(2)
}


export async function  queryProfile(suiClient :SuiClient){
    let pkg_addr = get_full_addr(config.pkg)
    let name = `${pkg_addr}::week_one_alt::ProfileCreated`
    let events = await suiClient.queryEvents({query:{MoveEventType:name}})
    let result =[]
    for(let i = 0 ; i < events.data.length; ++ i ){
        let element = events.data[i]
        console.log(element.type);
        // 返回的type后 ,pacakge地址会做地址补齐,32bytes 对应64个字符 再加上0x
        if(element.type == name){
            let event = element.parsedJson as unknown as ProfileCreated;
            let objectRet = await suiClient.getObject({id:event.profile,options:{showContent:true}})
            if(objectRet.data?.content?.dataType == "moveObject"){
                let s = objectRet.data?.content as unknown as Struct<Profile>
                let sc :Partial<Profile> = {};
                sc = s.fields;//由于fields字段不能修改,需要拷贝一份出来
                sc.owner = event.owner;
                console.log("fields",sc)
                result.push(sc);
            }
        }
    }
    return result
}
