export interface File {
  name: string;
  modified: string;
  imagepath: string;
}

export interface APIResponse {
  files: File[];
}
