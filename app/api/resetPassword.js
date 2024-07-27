// api/resetPassword.js

const resetPassword = async (token, newPassword) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
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
  
  export default resetPassword;
  