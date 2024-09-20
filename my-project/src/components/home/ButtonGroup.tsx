import React from "react";

interface ButtonGroupProps {
  activeView: number;
  onChangeView: (view: number) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  activeView,
  onChangeView,
}) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`px-4 py-1 text-sm font-medium ${
          activeView === 2
            ? " bg-gray-100 "
            : "text-gray-900 bg-white border-gray-200"
        } rounded-s-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
        onClick={() => onChangeView(2)}
      >
        <i className="material-icons text-gray-600 dark:text-gray-400">list</i>
      </button>
      <button
        type="button"
        className={`px-4 py-1 text-sm font-medium ${
          activeView === 1
            ? " bg-gray-100 "
            : "text-gray-900 bg-white border-gray-200"
        } rounded-e-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
        onClick={() => onChangeView(1)}
      >
        <i className="material-icons text-gray-600 dark:text-gray-400">
          grid_view
        </i>
      </button>
    </div>
  );
};

export default ButtonGroup;
