// function to get the profile of the user
import { Transaction } from "@mysten/sui/transactions";
import { suiClient, networkConfig } from "../../networkConfig";
import { State,User } from "../../type/profile";
export const create_profile = async (name: string, description: string) => {
    const tx = new Transaction()
    tx.moveCall({
        package: networkConfig.testnet.packageId,
        module: "filling",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.state)
        ]
    })
    return tx
}
    

//function to get the state of the contract
export const queryState = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageId}::filling::ProfileCreated`
        }
    })

    const state:State= {
        users:[]
    }
    events.data.map((event) => {
        const user = event.parsedJson as User;
        state.users.push(user);
    });


    return state;
}   
//get userdetails
export const getUserDetails = async (userId: string) => {
  try {
    const objectResponse = await suiClient.getObject({
      id: userId,
      options: {
        showContent: true
      }
    });

    if (objectResponse.data?.content?.dataType === "moveObject") {
      const fields = objectResponse.data.content.fields as {
        name: string;
        description: string;
      };
      
      return {
        name: fields.name,
        description: fields.description
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

