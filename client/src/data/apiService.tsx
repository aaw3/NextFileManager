import { data } from "./data";
import { APIResponse } from "./types";

export const getFilesFromAPI = async (): Promise<APIResponse> => {
  return new Promise<APIResponse>((resolve) => {
    setTimeout(() => {
      resolve(data as APIResponse);
    }, 1000);
  });
};
