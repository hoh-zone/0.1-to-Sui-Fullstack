// 合约需要展示的对象

export type  Profile = {
    // object 的唯一id
    id: string,
    // object 的信息
    name: string,
    description: string,
}

// 记录哪些用户创建了 object
export type State = {
    // 每个 sui object 都需要
    id: string,
    // ownew address , profile object address
    users: []
}

export type User = {
    address: string,
    owner: string
}