export interface File {
  name: string;
  modified: string;
  imagepath: string;
  mime: string;
}

export interface APIResponse {
  files: File[];
}
