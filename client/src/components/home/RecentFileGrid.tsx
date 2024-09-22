import React from "react";
import FileCard from "./RecentFileCard";

interface File {
  files: {
    name: string;
    created: string;
    modified: string;
    imagepath: string;
    mime: string;
  }[];
}

const RecentFilesGrid: React.FC<File> = ({ files }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {files.map((File, index) => (
        <FileCard key={index} file={File} />
      ))}
    </div>
  );
};

export default RecentFilesGrid;
