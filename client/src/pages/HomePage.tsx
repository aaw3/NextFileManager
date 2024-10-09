import React, { FC, useState } from "react";
import BreadCrumb from "../components/home/BreadCrumb";
import Header from "../components/home/Header";
import Sidebar from "../components/home/Sidebar";
import Home from "../components/home/sections/Home"; 
import Starred from "../components/home/sections/Starred";
import Shared from "../components/home/sections/Shared";
import Trash from "../components/home/sections/Trash";
import MyFiles from "../components/home/sections/MyFiles";

const HomePage: FC = () => {
  // Manage the current open section
  const [openSection, setOpenSection] = useState<string>("home");

  // Function to render the correct section based on the current open section
  const renderSection = () => {
    switch (openSection) {
      case "home":
        return <Home />;
      case "myfiles":
        return <MyFiles />;
      case "shared":
        return <Shared />;
      case "starred":
        return <Starred />;
      case "trash":
        return <Trash />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 h-full dark:bg-gray-900 flex flex-col pb-10">
      <Header />
      <div className="flex flex-1">
        {/* Pass the setOpenSection function to Sidebar */}
        <Sidebar openSection={openSection} setOpenSection={setOpenSection} />
        <div className="flex-1 p-4">
          <div className="p-2 pl-6 items-end">
            <BreadCrumb />
          </div>
          {/* Render the current section */}
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
