import React, { useRef, useEffect } from "react";

interface PDFViewerProps {
  filePath: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ filePath, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <button
        onClick={onClose}
        className="absolute top-10 right-10 text-white hover:text-gray-300 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Close</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg w-4/5 h-5/6 shadow-lg overflow-hidden"
      >
        <iframe
          src={filePath}
          title="PDF Viewer"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default PDFViewer;
