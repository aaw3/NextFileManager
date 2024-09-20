import React from "react";

interface RecentFilesTableProps {
  recentFiles: {
    name: string;
    opened: string;
    owner: string;
    activity: string;
  }[];
}

const RecentFilesTable: React.FC<RecentFilesTableProps> = ({ recentFiles }) => {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm rounded-lg bg-white dark:bg-gray-800">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600">
            <th className="text-left p-3 dark:text-white">Name</th>
            <th className="text-left p-3 dark:text-white">Opened</th>
            <th className="text-left p-3 dark:text-white">Owner</th>
            <th className="text-left p-3 dark:text-white">Activity</th>
          </tr>
        </thead>
        <tbody>
          {recentFiles.map((file, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <div className="flex flex-row">
                <img className="p-3 bg-white rounded-md mt-[10px] ml-2 h-4 w-4"></img>
                <td className="p-3 dark:text-gray-300">{file.name}</td>
              </div>
              <td className="p-3 dark:text-gray-300">{file.opened}</td>
              <td className="p-3 dark:text-gray-300">{file.owner}</td>
              <td className="p-3 dark:text-gray-300">{file.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentFilesTable;
