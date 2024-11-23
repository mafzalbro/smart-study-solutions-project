"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResourceCard from "@/app/components/resources/ResourceCard";
import PdfModal from "@/app/components/resources/PdfModal";
import BookViewer from "@/app/components/resources/BookViewer";
import StylishTitle from "@/app/components/StylishTitle";
import Skeleton from "react-loading-skeleton";
import Sidebar from "@/app/components/resources/Sidebar";
import { useAuth } from "@/app/customHooks/AuthContext";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaChevronLeft,
} from "react-icons/fa";
import { fetcher } from "@/app/utils/fetcher";
import LinkButton from "@/app/components/LinkButton";
import { MdShoppingCart } from "react-icons/md";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineInfoCircle,
  AiOutlineLock,
  AiOutlineLogin,
} from "react-icons/ai";
import { toast } from "react-toastify";
import ResourceMembershipMessage from "@/app/components/resources/StripMessage";
import SocialShare from "@/app/components/resources/SocialShare";

export default function ResourcePage({ params }) {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedResources, setRelatedResources] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratingNumber, setRatingNumber] = useState(null);
  const [isDownloadExceed, setIsDownloadExceed] = useState(true);
  const [isViewedExceed, setIsViewedExceed] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const { user } = useAuth();

  const { slug } = params;

  const updateResourceState = (updatedData) => {
    setResource((prevResource) => ({
      ...prevResource,
      ...updatedData,
    }));
    if (updatedData.likes !== undefined) setLikes(updatedData.likes);
    if (updatedData.dislikes !== undefined) setDislikes(updatedData.dislikes);
    if (updatedData.rating !== undefined) setRating(updatedData.rating);
    if (updatedData.ratingCount !== undefined)
      setRatingCount(updatedData.ratingCount);
    if (updatedData.hasLiked !== undefined) setHasLiked(updatedData.hasLiked);
    if (updatedData.hasDisliked !== undefined)
      setHasDisliked(updatedData.hasDisliked);
    if (updatedData.hasRated !== undefined) setHasRated(updatedData.hasRated);
    if (updatedData.ratingNumber !== undefined)
      setRatingNumber(updatedData.ratingNumber);
  };

  const handleLike = async () => {
    if (!hasLiked) {
      setHasLiked(true);
      setHasDisliked(false);
    }
    try {
      const updatedResource = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/like`,
        "POST"
      );
      if (!updatedResource) {
        throw new Error("Failed to like resource");
      }

      updateResourceState(updatedResource);

      if (updatedResource.likes) {
        setHasLiked(true);
        setHasDisliked(false);
      }
    } catch (error) {
      setHasLiked(true);
      setHasDisliked(false);
      updateResourceState(resource);
      console.error("Error liking resource:", error);
    }
  };

  const handleDislike = async () => {
    if (!hasDisliked) {
      setHasLiked(false);
      setHasDisliked(true);
    }
    try {
      const updatedResource = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/dislike`,
        "POST"
      );
      if (!updatedResource) {
        throw new Error("Failed to dislike resource");
      }
      updateResourceState(updatedResource);
      if (updatedResource.dislikes) {
        setHasLiked(false);
        setHasDisliked(true);
      }
    } catch (error) {
      updateResourceState(resource);
      setHasLiked(false);
      setHasDisliked(true);
      console.error("Error disliking resource:", error);
    }
  };

  const handleRating = async (ratingValue) => {
    if (!hasRated) {
      setHasRated(true);
      setRatingNumber(ratingValue);
    }
    try {
      const updatedResource = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/rate`,
        "POST",
        { rating: ratingValue }
      );
      if (!updatedResource) {
        throw new Error("Failed to rate resource");
      }
      updateResourceState(updatedResource);
    } catch (error) {
      updateResourceState(resource);
      console.error("Error rating resource:", error);
    }
  };

  useEffect(() => {
    const fetchResource = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}`
        );
        if (!data) {
          setResource(null);
          throw new Error("Failed to fetch resource data");
        }
        if (data.message == "Resource not found") {
          setResource(null);
        }
        document.title = data.title;
        setResource(data);
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setRating(data.rating);
        setHasLiked(data.hasLiked);
        setHasDisliked(data.hasDisliked);
        setHasRated(data.hasRated);
        setRatingCount(data.ratingCount);
        setRatingNumber(data.ratingNumber);
        setIsDownloadExceed(data.isDownloadExceed);
        setIsViewedExceed(data.isViewedExceed);

        // Fetch related resources
        const relatedRes = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/recommend?resourceSlug=${slug}`
        );
        if (relatedRes) {
          setRelatedResources(relatedRes);
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [slug]);

  const handleDownload = async () => {
    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/download-pdf/${slug}`
      );

      if (response.message == "Download limit reached") {
        setIsDownloadExceed(true);
      }
      if (response.downloadLink) {
        setIsDownloadExceed(false);
        // Open the download link in a new tab or window
        window.open(response.downloadLink, "_blank");
        toast.success("Download link generated successfully!");
      } else {
        throw new Error(response.message || "Download failed");
      }
    } catch (error) {
      if (error.message == "Download limit reached") {
        setIsDownloadExceed(true);
      }
      console.error("Error downloading PDF:", error);
      toast.error(error.message || "Error downloading PDF");
    }
  };

  const handleView = async () => {
    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/view-pdf/${slug}`
      );

      if (response.message == "View limit reached") {
        setIsViewedExceed(true);
      }
      if (response.viewLink) {
        // Open the view link in a new tab or window
        setIsViewedExceed(false);
        window.open(response.viewLink, "_blank");
        toast.success("View link generated successfully!");
      } else {
        throw new Error(response.message || "View failed");
      }
    } catch (error) {
      if (error.message == "View limit reached") {
        setIsViewedExceed(true);
      }
      console.error("Error viewing PDF:", error);
      toast.error(error.message || "Error viewing PDF");
    }
  };

  if (loading) {
    return (
      <div className="resource-item container mx-auto w-full my-12 px-4">
        <section className="flex flex-col md:flex-row gap-8">
          {/* Main Content Skeleton */}
          <main className="bg-secondary dark:bg-neutral-800 shadow-md bg-clip-border rounded-xl p-6 md:p-10 flex-1">
            {/* Back Link Skeleton */}
            <Skeleton height={30} width="200px" className="mb-4" />

            {/* Type, Tags, Dates Skeleton */}
            <Skeleton height={20} width="150px" className="mb-2" />
            <Skeleton height={20} width="250px" className="mb-2" />
            <Skeleton height={20} width="200px" className="mb-2" />
            <Skeleton height={20} width="200px" className="mb-6" />

            {/* Title Skeleton */}
            <Skeleton height={40} width="80%" className="mb-6" />

            {/* Image Skeleton */}
            <Skeleton height={200} width="100%" className="mb-4" />

            {/* Description Skeleton */}
            <Skeleton height={20} width="90%" className="mb-4" />
            <Skeleton height={20} width="85%" className="mb-4" />
            <Skeleton height={20} width="80%" className="mb-6" />

            {/* Buttons Skeleton */}
            <Skeleton height={50} width="150px" className="mb-4" />
            <Skeleton height={50} width="200px" className="mb-6" />

            {/* Likes and Dislikes Skeleton */}
            <Skeleton height={40} width="100px" className="mb-6" />
            <Skeleton height={40} width="100px" className="mb-6" />

            {/* Ratings Skeleton */}
            <Skeleton height={25} width="50%" className="mb-2" />
            <Skeleton height={40} width="60%" className="mb-6" />
          </main>

          {/* Sidebar Skeleton */}
          <aside className="md:w-1/3">
            <Skeleton height={500} width="100%" />
          </aside>
        </section>

        {/* Related Resources Skeleton */}
        <section className="w-full flex gap-2 flex-wrap justify-stretch mt-10">
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              height={300}
              width="30%"
              className="rounded-lg"
            />
          ))}
        </section>
      </div>
    );
  }
  if (!resource && !resource?.slug && !resource?.title) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="text-center text-white p-8 rounded-xl shadow-lg max-w-md w-full bg-white bg-opacity-40 backdrop-blur-lg">
          <h1 className="text-4xl font-extrabold mb-4">
            Oops! Something went wrong.
          </h1>
          <p className="text-lg font-semibold mb-6">
            The resource you're looking for could not be found.
          </p>
          <div className="animate-pulse flex justify-center mb-6">
            <span className="text-6xl">&#128533;</span>
          </div>
          <button
            onClick={() => window !== undefined && window.history.back()}
            className="bg-gradient-to-r from-yellow-400 to-red-600 text-white px-6 py-3 rounded-full shadow-md text-xl font-semibold transform hover:scale-105 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    resource && (
      <div className="resource-item container mx-auto w-full my-6 sm:my-12 px-6">
        <ResourceMembershipMessage />
        <section className="flex flex-col md:flex-row gap-12">
          <main className="text-neutral-800 dark:text-neutral-200 bg-secondary dark:bg-neutral-800 shadow-lg bg-clip-border rounded-xl p-8 md:p-12 flex-1">
            <Link
              href="/resources"
              className="text-accent-600 dark:text-accent-400 inline-flex items-center text-lg font-medium mb-4"
            >
              <FaChevronLeft className="mr-2" /> Back to Resources
            </Link>
            <div className="mt-6 text-sm md:text-base flex gap-6 flex-wrap">
              {resource?.type && (
                <p className="text-neutral-700 dark:text-neutral-300">
                  <strong>Type:</strong>
                  <Link
                    href={`/resources/type/${resource.type
                      .split(" ")
                      .join("-")}`}
                    className="text-accent-600 hover:text-accent-700 dark:text-accent-300 dark:hover:text-accent-400 transition-colors duration-200 capitalize ml-2"
                  >
                    {resource.type}
                  </Link>
                </p>
              )}
              {resource?.tags && (
                <p className="text-neutral-700 dark:text-neutral-300">
                  <strong>Tags:</strong>{" "}
                  {resource.tags.map((tag, i) => (
                    <Link
                      key={i}
                      href={`/resources/tag/${tag.split(" ").join("-")}`}
                      className="text-accent-600 hover:text-accent-700 dark:text-accent-300 dark:hover:text-accent-400 transition-colors duration-200 capitalize"
                    >
                      {tag}
                      {i < resource.tags.length - 1 && ", "}
                    </Link>
                  ))}
                </p>
              )}
              <p className="text-neutral-700 dark:text-neutral-300">
                <strong>Published At:</strong>{" "}
                <span className="text-neutral-800 dark:text-neutral-400 ml-2">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p className="text-neutral-700 dark:text-neutral-300">
                <strong>Updated At:</strong>{" "}
                <span className="text-neutral-800 dark:text-neutral-400 ml-2">
                  {new Date(resource.updatedAt).toLocaleDateString()}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <SocialShare
                title={resource?.title}
                url={`${process.env.NEXT_PUBLIC_FRONTEND_ORIGIN}/resources/${resource?.slug}`}
              />
            </div>

            <StylishTitle
              colored={resource.title}
              fontSize="text-lg sm:text-3xl lg:text-5xl"
              className="my-8 !mt-8 text-3xl lg:text-5xl font-bold"
            />

            <div className="flex items-center gap-6 mb-8">
              <button
                onClick={() => handleLike()}
                disabled={hasLiked}
                className={`flex items-center text-neutral-600 dark:text-neutral-300 text-lg font-medium transition-colors duration-200 ${
                  hasLiked
                    ? "text-blue-500"
                    : "hover:text-blue-500 dark:hover:text-blue-400"
                } disabled:text-blue-500 dark:disabled:text-blue-500 disabled:pointer-events-none`}
              >
                <AiFillLike className="mr-2 text-xl" /> {likes}
              </button>
              <button
                onClick={() => handleDislike()}
                disabled={hasDisliked}
                className={`flex items-center text-neutral-600 dark:text-neutral-300 text-lg font-medium transition-colors duration-200 ${
                  hasDisliked
                    ? "text-red-500"
                    : "hover:text-red-500 dark:hover:text-red-400"
                } disabled:text-red-500 dark:disabled:text-red-500 disabled:pointer-events-none`}
              >
                <AiFillDislike className="mr-2 text-xl" /> {dislikes}
              </button>
            </div>

            {resource?.profileImage && (
              <img
                src={resource.profileImage}
                alt={resource.title}
                className="mb-6 w-full mx-auto rounded-lg shadow-md"
              />
            )}

            {resource?.type === "notes" && !user?.isMember && (
              <div className="flex items-center border border-yellow-300 bg-yellow-50 rounded-lg p-4 dark:bg-yellow-800 dark:border-yellow-700">
                <AiOutlineInfoCircle className="text-yellow-600 mr-2 dark:text-yellow-300" />
                <span className="text-yellow-700 text-sm md:text-base dark:text-yellow-200">
                  These notes are part of our premium content. Please upgrade to
                  access.
                </span>
              </div>
            )}

            <p className="my-4 text-base md:text-lg">{resource?.description}</p>

            <div className="my-6 flex flex-col md:flex-row gap-4">
              {!!user && !user?.username && (
                <LinkButton
                  text="Please login to view PDF..."
                  icon={<AiOutlineLock />}
                  iconPosition="right"
                  link={"/login"}
                  className="!bg-accent-600 text-scondary text-sm md:text-base !py-2 !px-4 !rounded-full hover:!bg-accent-700 flex items-center justify-center gap-2 text-center"
                />
              )}

              {!!user &&
                user?.username &&
                (!isViewedExceed || user?.isMember) && (
                  <button
                    onClick={handleView}
                    className="bg-accent-600 text-white rounded-lg py-2 px-4 hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700"
                  >
                    View PDF
                  </button>
                )}

              {isDownloadExceed && (
                <div className="flex items-center justify-center bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 transition duration-200 ease-in-out transform hover:scale-105">
                  <AiOutlineLock className="mr-2 text-lg text-gray-200 dark:text-gray-400" />
                  <span className="text-sm md:text-base">
                    {resource.type === "notes"
                      ? "Cannot Download Notes in Free Version"
                      : "Download Limit Exceeded"}
                  </span>
                </div>
              )}
              {isViewedExceed && (
                <div className="flex items-center justify-center bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 transition duration-200 ease-in-out transform hover:scale-105">
                  <AiOutlineLock className="mr-2 text-lg text-gray-200 dark:text-gray-400" />
                  <span className="text-sm md:text-base">
                    {resource.type === "notes"
                      ? "Cannot View Notes in Free Version"
                      : "Views Limit Exceeded"}
                  </span>
                </div>
              )}

              {!!user &&
                user?.username &&
                (!isDownloadExceed || user?.isMember) && (
                  <button
                    onClick={handleDownload}
                    className="bg-accent-600 text-white rounded-lg py-2 px-4 hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700"
                  >
                    Download PDF
                  </button>
                )}

              {!!user &&
                !user.isMember &&
                (isDownloadExceed || isViewedExceed) && (
                  <LinkButton
                    text="Buy Membership to Download and View PDFs"
                    icon={<MdShoppingCart />}
                    link={"/pricing"}
                    className="!bg-accent-600 text-scondary text-sm md:text-base !py-2 !px-4 !rounded-full hover:!bg-accent-700 flex items-center justify-center gap-2 text-center"
                  />
                )}
            </div>

            <div>
              <h2 className="text-lg mb-2">
                Ratings: {rating?.toFixed(2)} / 5 ({ratingCount} ratings)
              </h2>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((ratingValue) => (
                  <button
                    key={ratingValue}
                    onClick={() => !hasRated && handleRating(ratingValue)}
                    className={`flex items-center ${
                      hasRated && ratingValue <= ratingNumber
                        ? "text-yellow-500 disabled:text-yellow-500"
                        : "text-neutral-500"
                    } disabled:pointer-events-none`}
                    disabled={hasRated}
                  >
                    <FaStar className="mr-1" />
                  </button>
                ))}
              </div>
            </div>
          </main>

          <aside className="md:w-1/3">
            <Sidebar resources={relatedResources} />
          </aside>
        </section>

        {relatedResources && (
          <>
            <StylishTitle
              colored={"Ralated Resources"}
              tagName="h2"
              fontSize="3xl text-4xl text-center"
            />
            <section className="w-full flex gap-2 flex-col md:flex-row my-10">
              {relatedResources?.map((resource) => (
                <ResourceCard
                  key={`${resource.slug}-${resource._id}-${Date.now()}`}
                  resource={resource}
                />
              ))}
            </section>
          </>
        )}
      </div>
    )
  );
}
