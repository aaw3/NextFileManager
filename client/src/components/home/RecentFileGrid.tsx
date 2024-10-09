import React, { useState } from "react";
import FileCard2 from "./RecentFileCard";

interface File {
  files: {
    fileName: string;
    created: string;
    modified: string;
    imagepath: string;
    mime_type: string;
  }[];
}

const RecentFilesGrid: React.FC<File> = ({ files }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const toggleMenu = (index: number) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null);
    } else {
      setOpenMenuIndex(index);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {files.map((file, index) => (
        <FileCard2
          key={index}
          file={file}
          isOpen={openMenuIndex === index} // Check if this card's menu is open
          toggleMenu={() => toggleMenu(index)} // Pass the toggle function
        />
      ))}
    </div>
  );
};

export default RecentFilesGrid;
