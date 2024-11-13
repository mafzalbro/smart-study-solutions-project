"use client";

import {
  clearExpiredCache,
  getCachedData,
  setCachedData,
  removeUserCacheHistory,
} from "@/app/(admin)/utils/caching";

export const fetcher = async (
  url,
  method = "GET",
  body = null,
  headers = {}
) => {
  await clearExpiredCache(); // Check and remove all expired items

  const token = localStorage.getItem("admin_token"); // Get token from local storage

  if (token === null) await removeUserCacheHistory();

  const path = window.location.pathname;

  // Cache key for GET requests
  const cacheKey = `${url}-${JSON.stringify(body)}-${method}`;

  // For GET method, retrieve cached data
  // if (method === "GET") {
  //   const cachedData = await getCachedData(cacheKey);
  //   if (cachedData) {
  //     console.log("Serving From Cache: ", cachedData);
  //     return cachedData.data; // Return cached data if available
  //   }
  // }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "true",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Include token in headers if available
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem("admin_token"); // Remove token on unauthorized access
  }
  // Handle unauthorized access
  if (response.status === 401 && !path.includes("/admin/login")) {
    localStorage.removeItem("admin_token"); // Remove token on unauthorized access
    window.location.replace(
      `${process.env.NEXT_PUBLIC_FRONTEND_ORIGIN}/admin/login`
    );
  } else if (
    response.status === 200 &&
    !token &&
    path.includes("/admin/login")
  ) {
    window.location.replace("/admin");
  }

  const data = await response.json();

  console.log({ data, status: response.status });

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  // Store new token if available in the response body
  if (data.token) {
    localStorage.setItem("admin_token", data.token); // Store token
  }

  // Cache the response data if it's a GET request
  if (method === "GET") {
    const cachedData = await getCachedData(cacheKey);
    if (!cachedData) {
      await setCachedData(cacheKey, data); // Cache the new data
    }
  }

  return data;
};
