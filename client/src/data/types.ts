export interface File {
  name: string;
  created: string;
  modified: string;
  imagepath: string;
  mime: string;
}

export interface APIResponse {
  files: File[];
}
