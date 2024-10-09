import React, { FC, useState, useEffect } from "react";
import LoadingIndicator from "../../../components/home/LoadingIndicator";
import ErrorDisplay from "../../../components/home/ErrorDisplay";
import SuggestedFilesGrid from "../../../components/home/SuggestedFilesGrid";
import RecentFilesGrid from "../../../components/home/RecentFileGrid";
import RecentFilesTable from "../../../components/home/RecentFilesTable";
import ButtonGroup from "../../../components/home/ButtonGroup";
import { getFilesFromAPI } from "../../../data/apiService";
import axios from "axios";

interface File {
  name: string;
  created: string;
  modified: string;
  imagepath: string;
  mime: string;
  size: number;
}

interface APIResponse {
  files: File[];
}

const Home: FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<number>(2);

  useEffect(() => {
  /*   const fetchData = async () => {
      try {
        const result: APIResponse = await getFilesFromAPI();
        setFiles(result.files);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData(); */
    axios
    .get(`http://127.0.0.1:8000/api/directory`, {
      params: {
        path: "",
      },
    })
    
    .then((response) => {
      setFiles(response.data);
      setLoading(false);
    })
    .catch((err) => {
      setError("Failed to fetch files.");
      setLoading(false);
    });
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
    <div>
      <section className="px-6">
        <h2 className="text-xl font-bold mt-6 mb-4 dark:text-white">For you</h2>
        <SuggestedFilesGrid files={files} />
      </section>
      <section className="px-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">Recent</h2>
          <div>
            <ButtonGroup activeView={view} onChangeView={setView} />
          </div>
        </div>
        {view === 1 ? <RecentFilesGrid files={files} /> : <RecentFilesTable files={files} />}
      </section>
    </div>
  );
};

export default Home;
