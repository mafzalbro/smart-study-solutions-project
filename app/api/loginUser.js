// api/loginUser.js

const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // Include credentials to send cookies or tokens
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error.message;
  }
};

export default loginUser;
