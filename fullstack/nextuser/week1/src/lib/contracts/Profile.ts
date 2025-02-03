import { MoveStruct } from "@mysten/sui/dist/cjs/client"
type  UID = {
    id : string,
}
export type Profile ={
    id :UID,
    name:string,
    description:string,
    owner?:string
}

export type Struct<T> =  {
    fields: T;
    type: string;
} 

export type Field<N,V> ={
    id:UID;
    name:N;
    value:V;
}

export type Table={
    id : UID,
    size : string
}


export type Address = string
export type State = {
    id:UID,
    users:Struct<Table>
}

export type User ={
    address :string,
    profile:string,
}


export type ProfileCreated= {
    profile: Address,
    owner: Address,
}
