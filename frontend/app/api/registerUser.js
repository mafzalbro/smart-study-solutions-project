// api/registerUser.js

const registerUser = async (userData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error.message;
  }
};

export default registerUser;
