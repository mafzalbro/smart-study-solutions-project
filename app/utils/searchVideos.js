import { fetcher } from "./fetcher";

export const searchVideo = async (query) => {
  try {
    const response = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/chat/search-videos?query=${query}`
    );

    console.log(response);

    if (response.message.includes("Results fetched successfully")) {
      // alert("Message sent and stored!");
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
