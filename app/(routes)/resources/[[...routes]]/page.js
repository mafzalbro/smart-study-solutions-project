"use client";

import React, { useState, useEffect } from "react";
import { fetcher } from "@/app/utils/fetcher";
import ResourceCard from "@/app/components/resources/ResourceCard";
import Spinner from "@/app/components/Spinner";
import StylishTitle from "@/app/components/StylishTitle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import TextInputField from "@/app/components/TextInputField";
import SideArea from "@/app/components/resources/SideArea";
import { useSearchParams, useRouter } from "next/navigation";
// import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import ResourceTabs from "@/app/components/resources/ResourceTabs";
import { AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import LinkButton from "@/app/components/LinkButton";

export default function ResourcesPage({ params }) {
  const routes = params?.routes || [];
  const router = useRouter();
  let query = useSearchParams();
  const q = query.get("query");

  const [resources, setResources] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(""); // For sorting options
  const [filterBy, setFilterBy] = useState({}); // For filtering options
  const results = 20;

  // Debounce search term
  useEffect(() => {
    if (q && debouncedSearchTerm == "" && searchTerm == "") {
      setSearchTerm(q.split("-").join(" "));
    }
    const debounceTimeout = setTimeout(() => {
      // if (searchTerm === "") {
      //   router.push(`/resources`);

      // } else {
      setDebouncedSearchTerm(searchTerm);
      // }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, router]);

  // Updated fetchResources
  const fetchResources = async (newPage = 1, reset = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", newPage);
      queryParams.append("limit", results);

      // If the search term is cleared, remove the query parameter
      if (debouncedSearchTerm) {
        router.push(
          `?query=${debouncedSearchTerm
            .trim()
            .split(" ")
            .join("-")
            .toLowerCase()}`
        );
        queryParams.append("query", debouncedSearchTerm || q);
        // } else if(routes[1] && debouncedSearchTerm == ""){
        //   router.push(`/resources/${routes[0]}/${routes[1]}`);
        // } else if (debouncedSearchTerm === "") {
        //   router.push(`/resources`);
      }

      if (sortBy) {
        queryParams.append("sortBy", sortBy);
      }

      const filterParams = { ...filterBy };

      //Adding api endpoint query params from url

      if (routes.length > 0) {
        if (routes[0] === "type") {
          filterParams.type = routes[1].split("-").join(" ");
        } else if (routes[0] === "tag") {
          filterParams.tags = routes[1].split("-").join(" ");
        } else if (routes[0] === "category") {
          filterParams.category = routes[1].split("-").join(" ");
        } else if (routes[1]?.includes("semester")) {
          if (routes[2]) {
            filterParams.degree = routes[0].split("-").join(" ");
            filterParams.semester = routes[1].split("-").join(" ");
            filterParams.type = routes[2].split("-").join(" ");
          } else {
            filterParams.degree = routes[0].split("-").join(" ");
            filterParams.semester = routes[1].split("-").join(" ");
          }
        }
      }

      if (Object.keys(filterParams).length > 0) {
        queryParams.append("filterBy", JSON.stringify(filterParams));
      }

      if (q && routes[1] && debouncedSearchTerm == "") {
        router.push(`/resources/${routes[0]}/${routes[1]}`);
      } else if (q && debouncedSearchTerm === "") {
        router.push(`/resources`);
      }

      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_ORIGIN
      }/api/resources?${queryParams.toString()}`;
      const data = await fetcher(url);
      const { data: fetchedResources, totalResults } = data.results;

      // Handle fetched resources
      if (reset || debouncedSearchTerm) {
        setResources(fetchedResources);
      } else {
        setResources((prevResources) => [
          ...prevResources,
          ...fetchedResources,
        ]);
      }

      setPage(newPage);
      setHasMore(newPage * results < totalResults);
    } catch (error) {
      setError(error);
      toast.error(`Error fetching resources: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchResources(1, true);
  }, [debouncedSearchTerm, sortBy, filterBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    fetchResources(nextPage, false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleFilterChange = ({ target: { name, value } }) => {
    setFilterBy((prevFilters) => ({
      ...prevFilters,
      [name]: value || undefined, // Only include filter if value is not empty
    }));
  };

  // Set document title and StylishTitle based on routes
  useEffect(() => {
    if (routes.length > 0) {
      const title =
        (!q ? routes[0].toUpperCase() : "") +
        (q
          ? `You searched for ${q}`
          : routes[1]
          ? ` - ${routes[1].toUpperCase()}`
          : "");
      document.title = title;
    } else {
      document.title = "Resources"; // Default title if no routes
    }
  }, [routes]);

  // const queryParams = new URLSearchParams();
  // console.log(queryParams)

  return (
    <div className="flex flex-col md:flex-row mb-10">
      <main className="flex-1">
        <section className="p-1 md:p-8 dark:text-secondary w-full">
          {routes[0] || q ? (
            <Link
              href="/resources"
              className="text-accent-600 dark:text-accent-300 inline-flex items-center mt-6 mx-2"
            >
              <FaChevronLeft className="mr-1" /> Back to Main Page
            </Link>
          ) : (
            ""
          )}

          <StylishTitle
            // Display the colored title based on the `routes[0]` value or show the search term `q` if it exists
            colored={
              q
                ? `"${decodeURIComponent(q).toUpperCase()}"`
                : routes[0]
                ? decodeURIComponent(routes[0])
                    .split("-")
                    .join(" ")
                    .toUpperCase()
                : "Books, Past Papers, Notes"
            }
            // Display additional info based on `routes[1]` value
            simple={
              q
                ? `${
                    routes[1]
                      ? ` in ${decodeURIComponent(routes[0])
                          .split("-")
                          .join(" ")
                          .toUpperCase()}: ${decodeURIComponent(routes[1])
                          .split("-")
                          .join(" ")
                          .toUpperCase()}`
                      : ""
                  }`
                : routes[1]
                ? ": " +
                  decodeURIComponent(routes[1])
                    .split("-")
                    .join(" ")
                    .toUpperCase()
                : ""
            }
            className="text-center"
          />

          <div className="mx-4 my-20" autoFocus>
            <TextInputField
              type="text"
              placeholder="Search study materials..."
              value={searchTerm}
              noMargin
              onChange={handleSearchChange}
              className="py-5 px-10 border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-accent-400 rounded-full focus:outline-none focus:ring-2 ring-accent-500"
              style={{ maxWidth: "600px" }}
              disabled={isLoading}
            />
          </div>
          <ResourceTabs />

          <div className="md:flex px-4 md:gap-4">
            <SideArea
              sortBy={sortBy}
              handleSortChange={handleSortChange}
              filterBy={filterBy}
              handleFilterChange={handleFilterChange}
            />
            <div className="flex-1">
              {isLoading && resources.length === 0 ? (
                <div className="flex flex-col gap-4">
                  <Skeleton height={250} />
                  <Skeleton height={250} />
                  <Skeleton height={250} />
                </div>
              ) : error ? (
                <p className="text-center text-red-500 my-20">
                  Error fetching resources: {error.message}
                </p>
              ) : resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 rounded-lg mt-8 mx-auto max-w-xl">
                  <div className="text-accent-600 dark:text-accent-400 text-5xl mb-4">
                    <AiOutlineInfoCircle />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
                    Nothing Here... Apologies for the inconvenience!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6 px-4">
                    We’re currently adding new materials to this section. If you
                    have any questions or would like to share study materials,
                    please reach out to us!
                  </p>
                  <LinkButton
                    link="/contact"
                    text={"Contact Us"}
                    icon={<AiOutlineMail />}
                    className="transition duration-300 transform hover:scale-105"
                  ></LinkButton>
                  <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm text-center">
                    We’re here to help you find what you need.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((resource) => (
                    <ResourceCard key={resource._id} resource={resource} />
                  ))}
                </div>
              )}

              {resources.length !== 0 &&
                !error &&
                hasMore &&
                !isLoadingMore && (
                  <div className="flex justify-center m-10">
                    <button
                      onClick={handleLoadMore}
                      className="border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-accent-400 rounded-full text-accent-500 hover:text-accent-700 font-bold py-4 px-6"
                    >
                      Load More
                    </button>
                  </div>
                )}

              {isLoadingMore && (
                <div className="flex justify-center mt-5">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
