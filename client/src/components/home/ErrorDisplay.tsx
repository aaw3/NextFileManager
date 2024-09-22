import React from "react";

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage }) => {
  return <div className="text-red-500 text-center p-4">{errorMessage}</div>;
};

export default ErrorDisplay;
