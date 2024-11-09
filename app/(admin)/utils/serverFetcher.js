export async function fetcher(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Check if the response status is OK (status in the range 200–299)
    if (!response.ok) {
      // const error = new Error(`HTTP error! Status: ${response.status}`);
      // error.status = response.status;
      // // error.response = await response.json();
      // throw error;
      return { data: null, status: response.status };
    }

    // Parse and return JSON response
    return { data: await response.json(), status: response.status };
  } catch (error) {
    console.error("Fetch error:", error);
    // Customize error handling here if needed
    throw error; // Re-throw error to be handled by the caller
  }
}
