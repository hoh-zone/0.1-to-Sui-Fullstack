export interface IProfile {
  owner: string;
  profile: string;
}

export interface IContent {
  id: { id: string };
  name: string;
  description: string;
  folders: string[];
  
}

export interface IFolder {
  id: { id: string };
  name: string;
  description: string;
}