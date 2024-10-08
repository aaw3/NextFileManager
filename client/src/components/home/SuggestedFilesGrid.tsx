import React from "react";
import FileCard from "./SuggestedFileCard";

interface SuggestedFilesGridProps {
  files: {
    name: string;
    created: string;
    modified: string;
    imagepath: string;
    mime: string;
  }[];
}

const SuggestedFilesGrid: React.FC<SuggestedFilesGridProps> = ({ files }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
      {files.map((file, index) => (
        <FileCard key={index} file={file} />
      ))}
    </div>
  );
};

export default SuggestedFilesGrid;
