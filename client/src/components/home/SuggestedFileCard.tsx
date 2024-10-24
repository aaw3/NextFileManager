import React, { useState } from "react";
import { Link } from "react-router-dom";
import ContextMenu from "./ContextMenu";

interface SuggestedFileCardProps {
  file: {
    fileName: string;
    created: string;
    modified: string;
    imagepath: string;
    mime_type: string;
  };
}

const SuggestedFileCard: React.FC<SuggestedFileCardProps> = ({ file }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (epoch: string) => {
    const date = new Date(parseInt(epoch) * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const removeFileExtension = (fileName: string) => {
    if (!fileName) return "Unnamed File";
    return fileName.replace(/\.[^/.]+$/, "");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md p-4 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
      <Link
        to="/"
        className="flex items-center space-x-4"
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
            {removeFileExtension(file.fileName)}
          </h3>
          <p className="text-xs sm:text-xxs dark:text-gray-400 mt-1">
            {formatDate(file.modified)}
          </p>
        </div>
      </Link>
      <div className="absolute top-[20px] right-4">
        <ContextMenu
          fileName={file.fileName}
          open="Open"
          rename="Rename"
          modify="Modify"
          onDelete="Delete"
          mime_type={file.mime_type}
          isOpen={isMenuOpen}
          toggleMenu={toggleMenu}
        />
      </div>
    </div>
  );
};

export default SuggestedFileCard;
