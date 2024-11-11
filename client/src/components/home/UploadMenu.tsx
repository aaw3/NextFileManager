import React, { useRef, useEffect } from "react";

interface UploadMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const UploadMenu: React.FC<UploadMenuProps> = ({ isOpen, toggleMenu }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        toggleMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleMenu]);

  const handleNewFolder = () => {
    console.log("New Folder option selected");
  };

  const handleFileUpload = () => {
    console.log("File Upload option selected");
  };

  const handleFolderUpload = () => {
    console.log("Folder Upload option selected");
  };

  return (
    <div
      className="relative"
      onContextMenu={(e) => {
        e.preventDefault();
        toggleMenu();
      }}
    >
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        id="dropdownMenuIconButton"
        className="inline-flex items-center p-2 text-md font-medium text-center text-gray-900 dark:text-white focus:ring-gray-50"
        type="button"
      >
        {/* Button content (if needed) */}
      </button>
      <div
        ref={menuRef}
        id="dropdownDots"
        className={`absolute right-0 mt-2 z-50 w-36 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 ${
          !isOpen ? "hidden" : ""
        }`}
      >
        <ul>
          <li>
            <button
              onClick={handleNewFolder}
              className="flex items-center w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white border-b border-gray-200 dark:border-gray-700"
            >
              <i className="material-icons text-sm mr-2">create_new_folder</i>
              New Folder
            </button>
          </li>
          <li>
            <button
              onClick={handleFileUpload}
              className="flex items-center w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white border-b border-gray-200 dark:border-gray-700"
            >
              <i className="material-icons text-sm mr-2">upload_file</i>
              File Upload
            </button>
          </li>
          <li>
            <button
              onClick={handleFolderUpload}
              className="flex items-center w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <i className="material-icons text-sm mr-2">drive_folder_upload</i>
              Folder Upload
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UploadMenu;
