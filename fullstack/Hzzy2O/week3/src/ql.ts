import { graphql } from '@mysten/sui/graphql/schemas/2024.4';

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
