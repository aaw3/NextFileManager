import React from "react";
import { Link } from "react-router-dom";

interface FileCardProps {
  file: {
    title: string;
    desc: string;
    filename: string;
  };
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  return (
    <Link
      to="/" // Add path later
      className="bg-white rounded-lg shadow-md p-3 dark:bg-gray-800 flex flex-row"
    >
      <img
        src=""
        alt=""
        className="w-11 h-11 mr-4 mt-2 bg-white object-cover rounded-lg"
      />
      <div>
        <h3 className="font-bold text-md mt-2 dark:text-white">{file.title}</h3>
        <p className="text-xs mb-4 dark:text-gray-400">{file.desc}</p>
      </div>
      <div className="ml-auto mt-5">
        <i className="material-icons text-gray-600 dark:text-gray-400">
          keyboard_arrow_right
        </i>
      </div>
    </Link>
  );
};

export default FileCard;
