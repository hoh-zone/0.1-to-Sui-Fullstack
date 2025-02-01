import { SuiGraphQLClient } from '@mysten/sui/graphql'
import { graphql } from '@mysten/sui/graphql/schemas/2024.4'
import { SUI_GRAPHQL_URL } from '../utils/constants'
import { FolderData } from './types/folder.type'

const gqlClient = new SuiGraphQLClient({
  url: SUI_GRAPHQL_URL,
})

/**
 * 获取文件夹信息
 */
export async function GetFolderListApi (objects: string[]) {
  const query = graphql(`
    query($objects: [String]){
      objects (
        filter: {
          objectIds: $objects
        }
      ) {
        nodes {
          asMoveObject {
            contents {
              json
            }
          }
        }
      }
    }
  `)

  const result = await gqlClient.query({
    query,
    variables: {
      objects,
    },
  })
  const folderList = result.data?.objects.nodes.map((node) => {
    if (node.asMoveObject?.contents?.json) {
      return node.asMoveObject?.contents?.json as FolderData
    }
    return null
  }).filter((item) => item !== null)
  return folderList
}

/**
 * 获取文件夹中存入的币
 */
interface FolderDynamicFieldData {
  name: {
    json: {
      name: string;
    };
  };
  value: {
    json: {
      value: number;
    };
  };
}
export async function GetFolderCoinListApi (folderId: string) {
  const query = graphql(`
    query($address: String) {
      owner(address: $address) {
        dynamicFields(
          first: 10
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            name {
              json
            }
            value {
              ... on MoveValue {
                json
              }
            }
          }
        }
      }
    }
  `)
  const result = await gqlClient.query({
    query,
    variables: {
      address: folderId,
    },
  })
  if (result.data?.owner?.dynamicFields?.nodes) {
    const res = result.data.owner.dynamicFields.nodes as FolderDynamicFieldData[]
    const format = res.map(d => {
      return {
        coinType: d.name.json.name,
        amount: d.value.json.value,
      }
    })
    return format
  }
  return []
}
