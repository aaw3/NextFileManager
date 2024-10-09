import React from "react";
import { Link } from "react-router-dom";

interface FileCardProps {
  file: {
    fileName: string;
    created: string;
    modified: string;
    imagepath: string;
    mime: string;
  };
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const formatDate = (epoch: string) => {
    const date = new Date(parseInt(epoch) * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const removeFileExtension = (fileName: string) => {
    if (!fileName) return fileName;
    return fileName.replace(/\.[^/.]+$/, "");
  };

  return (
    <Link
      to="/"
      className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800 flex items-center space-x-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
    >
      <img
        src={file.imagepath || "/images/placeholder.png"}
        className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-600 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-sm sm:text-sm md:text-md dark:text-white truncate"
          title={file.fileName}
        >
          {file.fileName}
        </h3>
        <p className="text-xs sm:text-xxs dark:text-gray-400 mt-1">
          {formatDate(file.modified)}
        </p>
      </div>
    </Link>
  );
};

export default FileCard;
