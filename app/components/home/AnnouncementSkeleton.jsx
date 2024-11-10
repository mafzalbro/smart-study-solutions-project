import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AnnouncementSkeleton = () => {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    setCounter((prev) => prev + 1);
  }, []);

  // Alternating image position based on the counter (even/odd)
  const imageOnLeft = counter % 2 === 0;

  return (
    <div className="relative flex flex-col md:flex-row h-[80vh] w-full overflow-hidden mb-4">
      {/* Full Background Image Section Skeleton */}
      <div
        className="absolute inset-0 bg-gray-300 animate-pulse opacity-40 blur-md"
        style={{
          zIndex: -1, // Place the full background image behind the content
        }}
      >
        <Skeleton height="100%" width="100%" />
      </div>

      {/* Image Section Skeleton */}
      <div
        className={`w-full md:w-1/2 h-full ${
          imageOnLeft ? "order-1 md:order-1" : "order-2 md:order-2"
        } flex justify-center items-center p-8`}
      >
        <Skeleton height="100%" width="100%" className="rounded-xl" />
      </div>

      {/* Content Section Skeleton */}
      <div
        className={`relative flex flex-col justify-center items-center text-center text-gray-600 p-10 md:w-1/2 h-full z-10 ${
          imageOnLeft ? "order-2 md:order-2" : "order-1 md:order-1"
        }`}
      >
        <Skeleton width="60%" height={40} className="mb-4" />
        <Skeleton width="80%" height={80} className="mb-6" />
        <Skeleton width={120} height={40} className="rounded-full" />
      </div>
    </div>
  );
};

export default AnnouncementSkeleton;
