import { suiGraphQLClient } from "@/networkConfig";
import { FolderData, SuiObject } from "@/type";
import { graphql } from '@mysten/sui/graphql/schemas/latest';


export const processObject = (objects: SuiObject[]): Record<string, SuiObject[]> => {
    const result: Record<string, SuiObject[]> = {
        'Coin': [],
        'NFT': []
    };
    objects.forEach((object) => {
        if (object.type.includes('0x2::coin::Coin')) {
            object.type = object.type.match(/<(.+)>/)?.[1] || object.type;
            result['Coin'].push(object);
        } else {
            result['NFT'].push(object);
        }
    });
    return result;
}



export const queryFolderDataContext = graphql(`
    query queryFolderDataContext($address:SuiAddress!) {
        object(address:$address){
            dynamicFields{
                nodes{
                    name{
                        json
                    }
                    value{
                    ...on MoveValue{
                            json
                        }
                    }
                }
            }
        }
    }
`)

export const queryFolderDataByGraphQL = async (folder: string) => {
    const result = await suiGraphQLClient.query({
        query: queryFolderDataContext,
        variables: {
            address: folder
        }
    })
    const folderData: FolderData[] = result.data?.object?.dynamicFields?.nodes?.map((node) => {
        const nameJson = node.name as { json: { name: string } };
        const valueJson = node.value as { json: { value: string } }; // Changed unknown to string to match FolderData type
        return {
            name: nameJson.json.name,
            value: valueJson.json.value
        }
    }) ?? [];
    console.log(folderData);
    return folderData;
}