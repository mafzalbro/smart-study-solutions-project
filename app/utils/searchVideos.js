import { fetcher } from "./fetcher";

export const searchVideo = async (query) => {
  try {
    const response = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/search-videos/youtube/get?query=${query}`
    );
    const isSuccessMessage = [
      "Results fetched successfully",
      "Results retrieved from cache",
      "Results fetched successfully (after retry)",
    ].some((msg) => response.message.includes(msg));

    if (isSuccessMessage) {
      return response.data;
    } else {
      // alert("Failed to send message.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching vidoes:", error);
    return [];
  }
};
