"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/app/utils/fetcher";
import LinkButton from "../LinkButton";
import { AiOutlineArrowRight } from "react-icons/ai"; // Replaced FaForward with AiOutlineArrowRight
import Skeleton from "react-loading-skeleton";
import { BiArrowToRight } from "react-icons/bi";

const RecommendationsForYou = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/recommend`
        );
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-center mb-12 text-primary dark:text-secondary">
        Recommendations For You
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Loading skeletons */}
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-105"
            >
              <Skeleton height={192} />
              <div className="p-4">
                <Skeleton height={24} width="80%" />
                <Skeleton count={2} />
                <Skeleton width="60%" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recommendations.map((resource) => (
            <div
              key={resource._id}
              className="bg-white dark:bg-gray-900 dark:text-secondary rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                {resource.profileImage ? (
                  <img
                    src={resource.profileImage || "/placeholder-image.jpg"}
                    alt={resource.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary dark:text-secondary truncate mb-3">
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {resource.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-200 mb-4">
                  {resource.degree && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {resource.degree}
                    </span>
                  )}
                  {resource.semester && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {resource.semester}
                    </span>
                  )}
                </div>
                <LinkButton
                  link={`/resources/${resource.slug}`}
                  text={"Open"}
                  icon={<AiOutlineArrowRight />}
                  iconPosition="right"
                  className="mt-4"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center ">
            <LinkButton
              text={"See All"}
              icon={<BiArrowToRight />}
              iconPosition="right"
              link={"/resources"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsForYou;
