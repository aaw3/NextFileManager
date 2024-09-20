import React from "react";
import { Link } from "react-router-dom";

interface FileCard2Props {
  file: {
    title: string;
    desc: string;
    filename: string;
  };
}

const FileCard2: React.FC<FileCard2Props> = ({ file }) => {
  return (
    <Link
      to="/" // Add path later
      className="bg-white rounded-lg shadow-md p-3 dark:bg-gray-800 flex flex-col"
    >
      {/* Placeholder Image */}
      <div className="w-full h-36 mb-2 bg-gray-200 rounded-lg">
        {/* Use an actual image here */}
        <img
          src="/path/to/placeholder-image.png" // Placeholder
          alt="File Thumbnail"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* File Title and Description */}
      <div className="flex flex-row justify-between items-start">
        <div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            {file.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {file.desc}
          </p>
        </div>
        <div className="flex flex-row items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            You modified • 12:43 PM
          </span>
        </div>
      </div>
    </Link>
  );
};

export default FileCard2;
