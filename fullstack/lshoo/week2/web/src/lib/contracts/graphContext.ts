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
