/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2025-01-15 19:00:00
 * @LastEditors: Hesin
 * @LastEditTime: 2025-01-15 19:00:07
 */
import { graphql } from '@mysten/sui/graphql/schemas/latest';

const queryFolderDataContext = graphql(`
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

export default queryFolderDataContext;