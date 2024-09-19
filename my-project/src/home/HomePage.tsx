import React, { FC } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ButtonGroup from "../components/ButtonGroup";

interface File {
  title: string;
  desc: string;
  filename: string;
}

interface RecentFile {
  name: string;
  opened: string;
  owner: string;
  activity: string;
}

const HomePage: FC = () => {
  const files: File[] = [
    {
      title: "S24 YC Schedule",
      desc: "You recently opened this",
      filename: "S24-ycschedule.docx",
    },
    {
      title: "YC Shoe Size",
      desc: "You edited this",
      filename: "S24-ycshoesize.docx",
    },
    {
      title: "Weekly Draft Emails",
      desc: "You edited this",
      filename: "S24-weeklydraftemails.docx",
    },
    {
      title: "YCT Notes 2024",
      desc: "You edited this",
      filename: "S24-ycnotes2024.docx",
    },
  ];

  const recentFiles: RecentFile[] = [
    {
      name: "HW1 Handout",
      opened: "Yesterday at 12:32 PM",
      owner: "Wright, Erik",
      activity: "Shared",
    },
    {
      name: "YC Shoe Size",
      opened: "Sun at 9:47 AM",
      owner: "Stamper, Liam",
      activity: "Edited",
    },
    {
      name: "S24 YC Schedule",
      opened: "Sun at 9:44 AM",
      owner: "Klever, Tommy",
      activity: "Opened",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 h-full dark:bg-gray-900 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4">
          <div className="p-2 pl-6 items-end">
            <BreadCrumb />
          </div>
          <section className="px-6">
            <h2 className="text-xl font-bold mt-6 mb-4 dark:text-white">
              For you
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {files.map((file: File, index: number) => (
                <Link
                  to="/" //add path later
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800"
                >
                  <h3 className="font-bold text-md mb-2 dark:text-white">
                    {file.title}
                  </h3>
                  <p className="text-xs mb-4 dark:text-gray-400">{file.desc}</p>
                </Link>
              ))}
            </div>
          </section>
          <section className="px-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">Recent</h2>
              <div>
                <ButtonGroup />
                <button
                  type="button"
                  className="ml-2 px-4 py-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                >
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm rounded-lg bg-white dark:bg-gray-800">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left p-4 dark:text-white">Name</th>
                    <th className="text-left p-4 dark:text-white">Opened</th>
                    <th className="text-left p-4 dark:text-white">Owner</th>
                    <th className="text-left p-4 dark:text-white">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFiles.map((file: RecentFile, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-gray-300 dark:border-gray-700"
                    >
                      <td className="p-4 dark:text-gray-300">{file.name}</td>
                      <td className="p-4 dark:text-gray-300">{file.opened}</td>
                      <td className="p-4 dark:text-gray-300">{file.owner}</td>
                      <td className="p-4 dark:text-gray-300">
                        {file.activity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
