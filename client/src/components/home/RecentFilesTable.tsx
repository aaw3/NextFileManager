import React, { useState } from "react";
import ContextMenu from "./ContextMenu";

interface RecentFilesTableProps {
  files: {
    name: string;
    created: string;
    modified: string;
    imagepath: string;
    mime: string;
  }[];
}

const RecentFilesTable: React.FC<RecentFilesTableProps> = ({ files }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const formatDate = (epoch: string) => {
    const date = new Date(parseInt(epoch) * 1000);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const removeFileExtension = (filename: string) => {
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
            <th className="text-left p-3 dark:text-white">Type</th>
            <th className="text-left p-3 dark:text-white">Location</th>
            <th className="text-left p-3 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <td className="p-3 dark:text-gray-300 flex items-center">
                <img
                  className="h-4 w-4 rounded-md bg-white mr-2"
                  src={file.imagepath || "/images/placeholder.png"}
                  alt={file.name}
                />
                {removeFileExtension(file.name)}
              </td>
              <td className="p-3 dark:text-gray-300">
                {formatDate(file.modified)}
              </td>
              <td className="p-3 dark:text-gray-300">{file.mime}</td>
              <td className="p-3 dark:text-gray-300">{"/" + file.name}</td>
              <td className="p-3 dark:text-gray-300">
                <ContextMenu
                  fileName={file.name}
                  open="Open"
                  rename="Rename"
                  modify="Modify"
                  onDelete="Delete"
                  isOpen={openMenuIndex === index}
                  toggleMenu={() => toggleMenu(index)}
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
