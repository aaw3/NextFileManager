import React, { useState } from "react";
import RecentFileCard from "./RecentFileCard";

interface File {
  files: {
    fileName: string;
    created: string;
    modified: string;
    imagepath: string;
    mime_type: string;
  }[];
  refreshData: () => void;
}

const RecentFilesGrid: React.FC<File> = ({ files, refreshData }) => {
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
        <RecentFileCard
          key={index}
          file={file}
          isOpen={openMenuIndex === index} 
          toggleMenu={() => toggleMenu(index)}
          refreshData={refreshData}
        />
      ))}
    </div>
  );
};

export default RecentFilesGrid;
