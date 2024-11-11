import React, { useState } from "react";
import ContextMenu from "./ContextMenu";
import PDFViewer from "./PDFViewer";

interface SuggestedFileCardProps {
  file: {
    fileName: string;
    created: string;
    modified: string;
    imagepath: string;
    mime_type: string;
  };
  refreshData: () => void;
}

const SuggestedFileCard: React.FC<SuggestedFileCardProps> = ({
  file,
  refreshData,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState<string>("");

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
        className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 cursor-pointer"
        onDoubleClick={handleCardDoubleClick}
      >
        <div className="flex items-center space-x-4">
          <img
            src={file.imagepath}
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
        </div>
        <div className="absolute top-[20px] right-4">
          <ContextMenu
            fileName={file.fileName}
            open="Open"
            rename="Rename"
            onDelete="Delete"
            mime_type={file.mime_type}
            isOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            refreshData={refreshData}
          />
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

export default SuggestedFileCard;
