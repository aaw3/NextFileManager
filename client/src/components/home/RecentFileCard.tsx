import React, { useState } from "react";
import ContextMenu from "./ContextMenu";
import PDFViewer from "./PDFViewer";

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
  refreshData: () => void;
}

const RecentFileCard: React.FC<RecentFileCardProps> = ({
  file,
  isOpen,
  toggleMenu,
  refreshData,
}) => {
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState<string>("");

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

  const handleCardDoubleClick = () => {
    if (file.mime_type === "application/pdf") {
      setCurrentFilePath(
        `http://127.0.0.1:8000/files/${encodeURIComponent(file.fileName)}`
      );
      setShowPDFViewer(true);
    } else {
      console.log(`Double-clicked on: ${file.fileName}`);
    }
  };

  return (
    <div className="relative">
      <div
        className="bg-white border border-gray-300 dark:border-none rounded-lg p-3 dark:bg-gray-800 flex flex-col cursor-pointer"
        onDoubleClick={handleCardDoubleClick}
      >
        <div className="w-full h-36 mb-2 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
          <img
            src={file.imagepath}
            className="w-full h-full object-cover dark:bg-gray-600"
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
            onDelete="Delete"
            mime_type={file.mime_type}
            isOpen={isOpen}
            toggleMenu={toggleMenu}
            refreshData={refreshData}
          />
        </div>

        <div className="mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            You modified • {formatDate(file.modified)}
          </span>
        </div>
      </div>

      {showPDFViewer && (
        <PDFViewer
          filePath={currentFilePath}
          onClose={() => setShowPDFViewer(false)}
        />
      )}
    </div>
  );
};

export default RecentFileCard;
