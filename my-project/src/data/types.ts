// types.ts or in the same file as the component (HomePage.tsx)

export interface File {
  title: string;
  desc: string;
  filename: string;
}

export interface RecentFile {
  name: string;
  opened: string;
  owner: string;
  activity: string;
}

export interface APIResponse {
  files: File[];
  recentFiles: RecentFile[];
}
