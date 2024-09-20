import { APIResponse } from "./types"; // Assuming you defined APIResponse type in a separate file
import { data } from "./data"; // Import the mock data

export const getFilesFromAPI = async (): Promise<APIResponse> => {
  return new Promise<APIResponse>((resolve) => {
    setTimeout(() => {
      resolve(data); // Resolve the data that matches APIResponse
    }, 1000); // Simulate a delay of 1 second
  });
};
