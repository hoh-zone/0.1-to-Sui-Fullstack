export interface Profile {
  id: string
  name: string
  description: string
}

export interface User {
  owner: string
  profile: string
}
