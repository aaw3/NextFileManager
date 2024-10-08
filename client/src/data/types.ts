export interface File {
  name: string;
  created: string;
  modified: string;
  imagepath: string;
  mime: string;
  size: number;
}

export interface APIResponse {
  files: File[];
}
