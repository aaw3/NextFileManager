import React from "react";
import { Link } from "react-router-dom";

interface FileCardProps {
  file: {
    name: string;
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
      className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800 flex items-center space-x-4"
    >
      <img
        src={file.imagepath || "/images/placeholder.png"}
        className="w-12 h-12 bg-gray-200 dark:bg-gray-600 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3
          className="font-bold text-md dark:text-white truncate"
          title={file.name}
        >
          {removeFileExtension(file.name)}
        </h3>
        <p className="text-[11px] dark:text-gray-400">
          {formatDate(file.modified)}
        </p>
      </div>
      {/* Fixed position and size for the arrow icon */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        <i className="material-icons text-gray-600 dark:text-gray-400">
          arrow_forward
        </i>
      </div>
    </Link>
  );
};

export default FileCard;
