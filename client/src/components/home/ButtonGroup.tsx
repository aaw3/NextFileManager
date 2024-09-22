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
        className={`px-4 py-1 text-sm font-medium border border-gray-200 ${
          activeView === 2
            ? " bg-gray-200 dark:bg-gray-700"
            : "dark:bg-gray-800"
        } rounded-s-lg dark:border-gray-700 dark:text-white dark:hover:text-white dark:focus:text-white`}
        onClick={() => onChangeView(2)}
      >
        <i className="material-icons text-gray-600 dark:text-gray-400">list</i>
      </button>
      <button
        type="button"
        className={`px-4 py-1 text-sm font-medium border border-gray-200 ${
          activeView === 1
            ? " bg-gray-200 dark:bg-gray-700"
            : "dark:bg-gray-800"
        } rounded-e-lg dark:border-gray-700 dark:text-white dark:hover:text-white dark:focus:text-white`}
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
