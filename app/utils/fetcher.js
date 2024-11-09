"use client";

import {
  clearExpiredCache,
  getCachedData,
  setCachedData,
  removeOlderCacheAfterMutation,
  removeUserCacheHistory,
} from "@/app/utils/caching";

export const fetcher = async (
  url,
  method = "GET",
  body = null,
  headers = {}
) => {
  await clearExpiredCache(); // Check and remove all expired items

  const token = localStorage.getItem("token"); // Get token from local storage

  if (token === null) await removeUserCacheHistory();

  const path = window.location.pathname;

  // Cache key for GET requests
  const cacheKey = `${url}-${JSON.stringify(body)}-${method}`;

  // For GET method, retrieve cached data
  if (method === "GET") {
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      console.log("Serving From Cache: ", cachedData);
      return cachedData.data; // Return cached data if available
    }
  }

  // Remove cached data for DELETE or PUT requests if present
  if (method === "DELETE" || method === "PUT") {
    await removeOlderCacheAfterMutation("/chat/");
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
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
    localStorage.removeItem("token");
    localStorage.removeItem("admin_token");
  }
  // Handle unauthorized access
  if (
    response.status === 401 &&
    !path.includes("/resources") &&
    path !== new URL(process.env.NEXT_PUBLIC_FRONTEND_ORIGIN).pathname
  ) {
    window.location.replace(`${process.env.NEXT_PUBLIC_FRONTEND_ORIGIN}/login`);
  } else if (
    response.status === 200 &&
    (path.includes("/login") ||
      path.includes("/login/google") ||
      path.includes("/register") ||
      path.includes("/register/google"))
  ) {
    window.location.replace("/");
  }

  const data = await response.json();

  console.log({ data, status: response.status });

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  // Store new token if available in the response body
  if (data.token) {
    localStorage.setItem("token", data.token); // Store token
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
