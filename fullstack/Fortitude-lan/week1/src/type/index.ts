/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2025-01-03 21:07:05
 * @LastEditors: Hesin
 * @LastEditTime: 2025-01-04 11:10:23
 */
export type Profile = {
    id: string,
    name: string,
    description: string,
}

export type State = {
    users: User[]
}

export type User = {
    owner: string,
    profile: string,
}