// File: loginUser.js

// api/loginUser.js

import { removeUserCacheHistory } from "../utils/caching";
import { fetcher } from "../utils/fetcher";
const loginUser = async (username, email, password, remember) => {
  if (email !== "" && email.includes("@")) {
    username = "";
  } else if (username.includes("@")) {
    email = username;
    username = "";
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/login`;
    await removeUserCacheHistory();
    return await fetcher(url, "POST", { username, email, password, remember });
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error.message;
  }
};

export default loginUser;
