// Example login function using fetch
export default async function (username, password) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include', // Important
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }
  
      const userData = await response.json();
      // Assuming backend returns user data or token upon successful login
      return userData;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw new Error('Failed to login');
    }
  };