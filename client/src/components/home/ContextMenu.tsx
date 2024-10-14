import React, { useRef, useEffect } from "react";

interface ContextMenuProps {
  fileName: string;
  open: string;
  modify: string;
  onDelete: string;
  rename: string;
  isOpen: boolean;
  toggleMenu: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  fileName,
  open,
  modify,
  onDelete,
  rename,
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

  // DELETE
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

  // OPEN
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

  // MODIFY
  const handleModify = () => {
    console.log(`Modifying file: ${fileName}`);
  };

  // RENAME
  const handleRename = async () => {
    const newName = prompt("Enter new file name:");
    if (newName) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/file`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            [fileName]: newName, }),
        });
        if (response.ok) {
          console.log(`File ${fileName} renamed to ${newName} successfully`);
        } else {
          const errorData = await response.json();
          console.error("Failed to rename file:", errorData.details || response.statusText);
        }
      } catch (error) {
        console.error("Error renaming file:", error);
      }
    }
  };

  return (
    <div
      className="relative"
      onContextMenu={(e) => {
        e.preventDefault();
        console.log("Context menu opened");
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
        className={`absolute right-0 mt-2 z-50 w-32 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 ${
          !isOpen ? "hidden" : ""
        }`}
      >
        <ul className="">
          <li>
            <button
              onClick={handleOpen}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white border-b border-gray-200 dark:border-gray-700"
            >
              {open}
            </button>
          </li>
          <li>
            <button
              onClick={handleRename}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white border-b border-gray-200 dark:border-gray-700"
            >
              {rename}
            </button>
          </li>
          <li>
            <button
              onClick={handleModify}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white border-b border-gray-200 dark:border-gray-700"
            >
              {modify}
            </button>
          </li>
          <li>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
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
