import { toast } from "react-toastify";
import { removeUserCacheHistory } from "@/app/utils/caching";
import { fetcher } from "@/app/utils/fetcher";

export const deleteUser = async () => {
  try {
    const response = await fetcher(
      `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/user/`,
      "DELETE"
    );

    if (response) {
      removeUserCacheHistory();
      toast.success("Profile deleted successfully");
      if (window !== undefined) {
        window.location.href = "/login";
        window.localStorage.clear();
      }
    } else {
      toast.error(
        `Error deleting profile: ${response.message || "Unknown error"}`
      );
    }
  } catch (error) {
    toast.error(`Error deleting profile: ${error.message}`);
  }
};
