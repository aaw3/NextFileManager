import React, { FC, useEffect, useState } from "react";
import BreadCrumb from "../components/home/BreadCrumb";
import Header from "../components/home/Header";
import Sidebar from "../components/home/Sidebar";
import ButtonGroup from "../components/home/ButtonGroup";
import LoadingIndicator from "../components/home/LoadingIndicator";
import SuggestedFilesGrid from "../components/home/SuggestedFilesGrid";
import RecentFilesTable from "../components/home/RecentFilesTable";
import ErrorDisplay from "../components/home/ErrorDisplay";
import { getFilesFromAPI } from "../data/apiService";
import RecentFilesGrid from "../components/home/RecentFileGrid";

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

interface APIResponse {
  files: File[];
  recentFiles: RecentFile[];
}

const HomePage: FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<number>(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: APIResponse = await getFilesFromAPI();
        setFiles(result.files);
        setRecentFiles(result.recentFiles);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay errorMessage={error} />;
  }

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
            <SuggestedFilesGrid files={files} />
          </section>
          <section className="px-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">Recent</h2>
              <div>
                <ButtonGroup activeView={view} onChangeView={setView} />
              </div>
            </div>
            {view === 1 ? (
              <RecentFilesGrid files={files} />
            ) : (
              <RecentFilesTable recentFiles={recentFiles} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
