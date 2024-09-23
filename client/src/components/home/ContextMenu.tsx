import React, { useRef, useEffect } from "react";

interface ContextMenuProps {
  fileName: string;
  open: string;
  modify: string;
  onDelete: string;
  isOpen: boolean;
  toggleMenu: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  fileName,
  open,
  modify,
  onDelete,
  isOpen,
  toggleMenu,
}) => {
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/files/${fileName}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log(`File ${fileName} deleted successfully`);
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleOpen = async () => {
    try {
      const response = await fetch(`/api/files/${fileName}`, {
        method: "OPEN",
      });
      if (response.ok) {
        console.log(`File ${fileName} openedsuccessfully`);
      } else {
        console.error("Failed to open file");
      }
    } catch (error) {
      console.error("Error openingß file:", error);
    }
  };

  const handleModify = () => {
    console.log(`Modifying file: ${fileName}`);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        id="dropdownMenuIconButton"
        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 dark:text-white focus:ring-gray-50"
        type="button"
      >
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>
      <div
        ref={menuRef}
        id="dropdownDots"
        className={`absolute right-0 mt-2 z-50 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 ${
          !isOpen ? "hidden" : ""
        }`}
      >
        <ul className="py-2">
          <li>
            <button
              onClick={handleOpen}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {open}
            </button>
          </li>
          <li>
            <button
              onClick={handleModify}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {modify}
            </button>
          </li>
          <li>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {onDelete}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
