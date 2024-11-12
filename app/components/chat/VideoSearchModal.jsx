import React, { useState, useEffect } from "react";
import { searchVideo } from "@/app/utils/searchVideos";

const VideoSearchModal = ({ query, isOpen, onClose }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && query) {
      fetchVideos();
    }
  }, [isOpen, query]);

  const fetchVideos = async () => {
    setIsLoading(true);
    const videoResults = await searchVideo(query);
    setVideos(videoResults);
    setIsLoading(false);
  };

  return (
    isOpen && (
      <div className="fixed top-0 right-0 z-50 h-full w-3/4 md:w-1/2 bg-white dark:bg-neutral-900 p-4 shadow-lg overflow-y-auto">
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-300 float-right"
        >
          Close
        </button>
        <h2 className="text-xl font-semibold mb-4">Related Videos</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-full h-20 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <ul>
            {console.log({ videos })}
            {videos?.length > 0 &&
              videos?.map((video) => (
                <li key={video.id} className="mb-4">
                  <a
                  // href={`https://www.youtube.com/watch?v=${video.id}`}
                  // target="_blank"
                  // rel="noopener noreferrer"
                  // className="block p-2 border rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <p className="font-semibold">{video.snippet.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {video.snippet.description}
                    </p>
                  </a>
                </li>
              ))}
          </ul>
        )}
      </div>
    )
  );
};

export default VideoSearchModal;
