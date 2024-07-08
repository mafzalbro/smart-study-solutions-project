// api/forgotPassword.js

const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      if (!response.ok) {
        throw new Error('Password change failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error changing password:', error.message);
      throw error.message;
    }
  };
  
  export default forgotPassword;
  