import React, { useRef, useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import Notification from "./Notification";

interface ContextMenuProps {
  fileName: string;
  open: string;
  onDelete: string;
  rename: string;
  mime_type: string;
  isOpen: boolean;
  toggleMenu: () => void;
  refreshData: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  fileName,
  open,
  onDelete,
  rename,
  mime_type,
  isOpen,
  toggleMenu,
  refreshData,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);

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

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(false); 
    setTimeout(() => setShowNotification(true), 0); 
  };

  const handleDeleteFile = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/file?path=${encodeURIComponent(fileName)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        showNotificationMessage(`File ${fileName} deleted successfully`);
        refreshData();
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleDeleteDirectory = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/directory?path=${encodeURIComponent(fileName)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        showNotificationMessage(`Directory ${fileName} deleted successfully`);
        refreshData();
      } else {
        console.error("Failed to delete directory");
      }
    } catch (error) {
      console.error("Error deleting directory:", error);
    }
  };
  
  const handleOpen = async () => {
    try {
      const response = await fetch(`/api/files/${fileName}`, {
        method: "OPEN",
      });
      if (response.ok) {
        console.log(`File ${fileName} opened successfully`);
      } else {
        console.error("Failed to open file");
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const handleModify = () => {
    console.log(`Modifying file: ${fileName}`);
  };

  const handleRename = async () => {
    const newName = prompt("Enter new file name:", fileName);
    if (newName) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/file`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [fileName]: newName,
          }),
        });
        if (response.ok) {
          showNotificationMessage(`File ${fileName} renamed to ${newName} successfully`);
          setShowNotification(true);
          refreshData();
        } else {
          const errorData = await response.json();
          console.error("Failed to rename file:", errorData.details || response.statusText);
        }
      } catch (error) {
        console.error("Error renaming file:", error);
      }
    }
  };

  const confirmDelete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(false);
    if (mime_type === "inode/directory") {
      handleDeleteDirectory();
    } else {
      handleDeleteFile();
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
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
        className={`absolute right-0 mt-2 z-50 w-36 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 ${
          !isOpen ? "hidden" : ""
        }`}
      >
        <ul>
          <li>
          <button
              onClick={handleOpen}
              className="flex items-center w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white border-b border-gray-200 dark:border-gray-700"
            >
              <i className="material-icons text-sm mr-2">file_open</i>
              {open}
            </button>
          </li>
          <li>
          <button
              onClick={handleRename}
              className="flex items-center w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white border-b border-gray-200 dark:border-gray-700"
            >
              <i className="material-icons text-sm mr-2">edit</i>
              {rename}
            </button>
          </li>
          <li>
            <button
              onClick={confirmDelete}

              className="block w-full text-left px-4 py-2 text-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <i className="material-icons text-sm mr-2">delete</i>
              {onDelete}
            </button>
          </li>
        </ul>
      </div>
      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this file?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default ContextMenu;