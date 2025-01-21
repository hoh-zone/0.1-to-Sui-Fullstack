export interface IProfile {
  owner: string;
  profile: string;
}

export interface IContent {
  name: string;
  description: string;
  folders: string[];
  id: { id: string };
}
