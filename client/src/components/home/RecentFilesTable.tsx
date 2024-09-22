import React from "react";

interface RecentFilesTableProps {
  files: {
    name: string;
    modified: string;
    imagepath: string;
  }[];
}

const RecentFilesTable: React.FC<RecentFilesTableProps> = ({ files }) => {
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
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm rounded-lg bg-white dark:bg-gray-800">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600">
            <th className="text-left p-3 dark:text-white">Name</th>
            <th className="text-left p-3 dark:text-white">Modified</th>
            <th className="text-left p-3 dark:text-white">Type</th>
            <th className="text-left p-3 dark:text-white">Location</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <div className="flex flex-row">
                <img className="p-3 bg-white rounded-md mt-[10px] ml-2 h-4 w-4"></img>
                <td className="p-3 dark:text-gray-300">
                  {removeFileExtension(file.name)}
                </td>
              </div>
              <td className="p-3 dark:text-gray-300">
                {formatDate(file.modified)}
              </td>
              <td className="p-3 dark:text-gray-300">{file.name}</td>
              <td className="p-3 dark:text-gray-300">{"/" + file.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentFilesTable;
