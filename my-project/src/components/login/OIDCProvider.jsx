import React from "react";
import oidcProviders from "./oidcConfig";

const OIDCProvider = () => {
  return (
    <div className="w-full mt-2 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      
      {oidcProviders.map((provider) => (
        <div key={provider.name} className="mb-2 flex justify-center">
          <button
            onClick={() => window.location.href = provider.link} // Handle the link redirection
            className="flex items-center justify-center text-center mt-2 w-4/5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <img
              src={provider.icon}
              alt={`${provider.name} icon`}
              className="w-6 h-6 mr-3"
            />
            <span>{`Login with ${provider.name}`}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default OIDCProvider;
