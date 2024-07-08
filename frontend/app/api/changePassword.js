// api/changePassword.js

const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include"
        ,
        body: JSON.stringify({ currentPassword, newPassword })
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
  
  export default changePassword;
  