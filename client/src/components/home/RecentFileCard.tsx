import React from "react";
import { Link } from "react-router-dom";
import ContextMenu from "./ContextMenu";

interface RecentFileCardProps {
  file: {
    fileName: string;
    created: string;
    modified: string;
    imagepath: string;
    mime_type: string;
  };
  isOpen: boolean;
  toggleMenu: () => void;
}

const RecentFileCard: React.FC<RecentFileCardProps> = ({
  file,
  isOpen,
  toggleMenu,
}) => {
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
    if (!filename) return "";
    return filename.replace(/\.[^/.]+$/, "");
  };

  return (
    <div className="relative">
      <div className="bg-white border border-gray-300 dark:border-none rounded-lg p-3 dark:bg-gray-800 flex flex-col">
        <div className="w-full h-36 mb-2 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
          <img
            src={file.imagepath || "/path/to/placeholder-image.png"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-center">
          <h3
            className="font-bold text-sm text-gray-900 dark:text-white truncate"
            title={file.fileName}
          >
            {removeFileExtension(file.fileName)}
          </h3>
          <ContextMenu
            fileName={file.fileName}
            open="Open"
            rename="Rename"
            modify="Modify"
            onDelete="Delete"
            mime_type={file.mime_type}
            isOpen={isOpen}
            toggleMenu={toggleMenu}
          />
        </div>

        <div className="mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            You modified • {formatDate(file.modified)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentFileCard;
