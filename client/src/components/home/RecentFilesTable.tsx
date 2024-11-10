import React, { useState } from "react";
import ContextMenu from "./ContextMenu";

interface RecentFilesTableProps {
  files: {
    fileName: string;
    created: string;
    modified: string;
    size: number; 
    imagepath: string;
    mime_type: string;
  }[];
  refreshData: () => void
}

const RecentFilesTable: React.FC<RecentFilesTableProps> = ({ files, refreshData }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const formatDate = (epoch: string) => {
    const date = new Date(parseInt(epoch) * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (size: number, mime: string) => {
    console.log(mime);
    if (mime === "inode/directory") return "-";
    if (size === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    const fileSize = size / Math.pow(k, i);
    return `${fileSize % 1 === 0 ? fileSize : fileSize.toFixed(2)} ${sizes[i]}`;
  };
  

  const removeFileExtension = (filename: string) => {
    if (!filename) return "";
    return filename.replace(/\.[^/.]+$/, "");
  };

  const toggleMenu = (index: number) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null);
    } else {
      setOpenMenuIndex(index);
    }
  };

  return (
    <div className="">
      <table className="min-w-full text-sm rounded-lg bg-white dark:bg-gray-800">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600">
            <th className="text-left p-3 dark:text-white">Name</th>
            <th className="text-left p-3 dark:text-white">Modified</th>
            <th className="text-left p-3 dark:text-white">Size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <td className="p-3 dark:text-gray-300 flex items-center">
              <img src = {file.imagepath || "/images/placeholder.png"} className="p-3 bg-white rounded-md ml-2 mr-2 my-1 h-4 w-4"></img>
                {removeFileExtension(file.fileName)}
              </td>
              <td className="p-3 dark:text-gray-300">
                {formatDate(file.modified)}
              </td>
              <td className="p-3 dark:text-gray-300">
                {formatFileSize(file.size, file.mime_type)}
              </td>
              <td className="p-3 text-right dark:text-gray-300">
                <ContextMenu
                  fileName={file.fileName}
                  open="Open"
                  rename="Rename"
                  onDelete="Delete"
                  mime_type={file.mime_type}
                  isOpen={openMenuIndex === index}
                  toggleMenu={() => toggleMenu(index)}
                  refreshData={refreshData}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentFilesTable;
