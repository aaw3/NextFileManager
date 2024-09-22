import React from "react";
import { Link } from "react-router-dom";

interface RecentFileCardProps {
  file: {
    name: string;
    modified: string;
    imagepath: string;
  };
}
const FileCard2: React.FC<RecentFileCardProps> = ({ file }) => {
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
    <Link
      to="/"
      className="bg-white rounded-lg shadow-md p-3 dark:bg-gray-800 flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out"
    >
      <div className="w-full h-36 mb-2 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
        <img
          src={file.imagepath || "/path/to/placeholder-image.png"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1">
          <h3
            className="font-bold text-sm text-gray-900 dark:text-white truncate"
            title={file.name}
          >
            {removeFileExtension(file.name)}{" "}
          </h3>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          You modified • {formatDate(file.modified)}
        </span>
      </div>
    </Link>
  );
};

export default FileCard2;
