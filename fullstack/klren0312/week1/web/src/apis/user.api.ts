import { SuiGraphQLClient } from '@mysten/sui/graphql'
import { graphql } from '@mysten/sui/graphql/schemas/2024.4'
import { SUI_GRAPHQL_URL } from '../utils/constants'
import { UserDetail } from './types/user.type'

const gqlClient = new SuiGraphQLClient({
  url: SUI_GRAPHQL_URL,
})

/**
 * 获取当前用户的profile
 */
export async function GetCurrentUserProfileApi (type: string, owner: string) {
  const query = graphql(`
    query {
      objects(
        first: 1
        filter: {
          type: "${type}"
          owner: "${owner}"
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
  })
  if (result.data?.objects && result.data.objects.nodes && result.data.objects.nodes.length > 0) {
    const node = result.data.objects.nodes[0]
    const profile = node.asMoveObject?.contents?.json as UserDetail
    return profile
  }
  return null
}

/**
 * 获取用户
 * @param packageId 包 ID
 * @returns 用户
 */
export async function GetUsersApi (packageId: string, endCursor: string | null = null, startCursor: string | null = null) {
  const query = graphql(`
    query($endCursor: String, $startCursor: String) {
      events(
        first: 10
        after: $endCursor
        before: $startCursor
        filter: {
          eventType: "${packageId}::week_one::ProfileCreated"
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        nodes {
          contents {
            json
          }
        }
      }
    }
  `)
  const result = await gqlClient.query({
    query,
    variables: { endCursor, startCursor },
  })
  return result.data?.events
}

/**
 * 获取用户详情
 * @param packageId 包 ID
 * @param profileId 用户 ID
 * @returns 用户详情
 */
export async function GetUserDetailApi (profileId: string) {
  const query = graphql(`
    query {
      object(address: "${profileId}") {
        asMoveObject {
          contents {
            json
          }
        }
      }
    }
  `)
  const result = await gqlClient.query({
    query,
  })
  if (result.data?.object && result.data.object.asMoveObject && result.data.object.asMoveObject.contents) {
    const user = result.data.object.asMoveObject.contents.json as UserDetail
    return user
  }
  return null
}
