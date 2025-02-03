import { networkConfig, suiClient } from "@/networkConfig"
import { State,User} from "@/type"
import { Transaction } from "@mysten/sui/transactions"
export const queryState = async() => { 
    const event = await suiClient.queryEvents({
     query: {
       MoveEventType: `${networkConfig.testnet.packageID}::week_two::ProfileCreated`
     },
    })
    const state: State = {
        users:[]
    }
    event.data.map((event)=> {
        const user = event.parsedJson as User;
        state.users.push(user);
    })
    return state
}

/*
public entry fun create_profile(
        name: String, 
        description: String, 
        state: &mut State,
        ctx: &mut TxContext
    )
*/
export const createProfileTx = async (name: string, description: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "week_two",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.state),
        ]
    })
    return tx
}

/*
 public entry fun create_folder(
        name: String, 
        description: String, 
        profile: &mut Profile,
        ctx: &mut TxContext
    ){
        let owner = tx_context::sender(ctx);
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let new_folder = Folder {
            id: uid,
            name,
            description,
            // dynamic field
        };

        transfer::transfer(new_folder, owner);
        vector::push_back(&mut profile.folders, object::id_to_address(&id));
        event::emit(FolderCreated{
         id,
         owner,   
        })

        
    }*/

        const FolderCreated = await suiClient.queryEvents({
            query: {
              MoveEventType: `${networkConfig.testnet.packageID}::week_two::FolderCreated`
            },
           })
           const state: State = {
               users:[]
           }
           FolderCreated.data.map((FolderCreated)=> {
               const user = FolderCreated.parsedJson as User;
               state.users.push(user);
           })
           return state
       }

    /*public entry fun add_coin_to_folder<T>(
        folder:&mut Folder,
        coin :Coin<T>,
        _ctx: &mut TxContext
    ){
        let type_name = type_name::get<T>();
        let amount = coin::value(&coin);
        let total;
        
        if (!dynamic_field::exists_(&folder.id, type_name)) {
            dynamic_field::add(&mut folder.id, type_name, coin::into_balance(coin));
            total = amount;
        }else{
            let mut old_value = dynamic_field::borrow_mut<TypeName,Balance<T>>(&mut folder.id, type_name);
            balance::join(old_value, coin::into_balance(coin));
            total = balance::value(old_value);
        };

        event::emit(CoinWrappend{
            folder: object::uid_to_address(&folder.id),
            coin_type: type_name::into_string(type_name),
            amount,
            balance: total,
        })
    }
*/