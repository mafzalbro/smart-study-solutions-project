import React, { useState, useEffect } from "react";
import { searchVideo } from "@/app/utils/searchVideos";
import { AiOutlineRollback } from "react-icons/ai";

const VideoSearchModal = ({ query, isOpen, onClose }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null); // Track selected video

  useEffect(() => {
    if (isOpen && query) {
      fetchVideos();
    }
  }, [isOpen, query]);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const videoResults = await searchVideo(query);
      setVideos(videoResults);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed top-0 right-0 z-50 h-full w-full md:w-3/4 lg:w-1/2 bg-white dark:bg-neutral-900 p-6 shadow-lg overflow-y-auto transition-all duration-300 ease-in-out">
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 float-right mb-4"
        >
          Close
        </button>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
          Related Videos
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-full h-20 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : selectedVideo ? (
          // Render iframe for selected video
          <>
            <button
              onClick={() => setSelectedVideo(null)}
              className="my-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400"
            >
              <AiOutlineRollback /> Back to Video List
            </button>
            <div className="relative w-full h-0 pb-[56.25%] mb-6">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-md"
                src={`https://www.youtube.com/embed/${selectedVideo}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </>
        ) : (
          <ul>
            {videos?.length > 0 ? (
              videos.map((video) => (
                <li key={video.id} className="mb-6">
                  <div
                    onClick={() => setSelectedVideo(video.id)}
                    className="cursor-pointer flex flex-col md:flex-row items-start p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors duration-200"
                  >
                    <img
                      src={video.thumbnail.thumbnails[0].url}
                      alt={video.title}
                      className="w-full md:w-32 h-20 rounded-md mb-3 md:mb-0 md:mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-100 leading-tight">
                        {video.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {video.channelTitle}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Duration: {video.length.simpleText}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center mt-6">
                No videos found.
              </p>
            )}
          </ul>
        )}
      </div>
    )
  );
};

export default VideoSearchModal;
