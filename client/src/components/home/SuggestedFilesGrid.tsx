import React from "react";
import FileCard from "./SuggestedFileCard";

interface SuggestedFilesGridProps {
  files: {
    fileName: string;
    created: string;
    modified: string;
    imagepath: string;
    mime_type: string;
  }[];
}

const SuggestedFilesGrid: React.FC<SuggestedFilesGridProps> = ({ files }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
      {files.slice(0, 10).map((file, index) => (
        <FileCard key={index} file={file} />
      ))}
    </div>
  );
};

export default SuggestedFilesGrid;
