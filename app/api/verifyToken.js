// api/verifyToken.js

const verifyToken = async (token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/auth/verifyToken?token=${token}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Token verification failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error verifying token:', error.message);
      throw error.message;
    }
  };
  
  export default verifyToken;
  