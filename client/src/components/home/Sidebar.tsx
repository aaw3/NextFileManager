import React, { FC } from "react";

interface Icon {
  icon: string;
  id: string;
}

interface SidebarProps {
  openSection: string;  // The currently open section
  setOpenSection: (section: string) => void;  // Function to change the open section
}

const Sidebar: FC<SidebarProps> = ({ openSection, setOpenSection }) => {
  const icons: Icon[] = [
    { icon: "home", id: "home" },
    { icon: "folder", id: "myfiles" },
    { icon: "group", id: "shared" },
    { icon: "star", id: "starred" },
    { icon: "delete", id: "trash" },
  ];

  const isActive = (id: string): boolean => id === openSection;

  return (
    <div className="h-screen w-16 bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-4 space-y-4">
      <button className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center">
        <i className="material-icons text-white text-2xl">add</i>
      </button>

      <div className="flex flex-col space-y-4 items-center">
        {icons.map((icon: Icon) => (
          <i
            key={icon.id}
            onClick={() => setOpenSection(icon.id)}  // Update the open section on click
            className={`material-icons cursor-pointer ${
              isActive(icon.id)
                ? "text-blue-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {icon.icon}
          </i>
        ))}

        <div className="border-t border-gray-300 w-8 dark:border-gray-700"></div>

        <div className="mt-auto mb-2">
          <i className="material-icons text-gray-600 dark:text-gray-400">
            more_horiz
          </i>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
