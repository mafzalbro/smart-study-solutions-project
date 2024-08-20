"use client";

export const fetcher = async (url, method = 'GET', body = null, headers = {}) => {
  // Retrieve token from local storage
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.status === 401) {
      // If unauthorized, remove token and redirect to login
      localStorage.removeItem('token');
      localStorage.setItem('isLoggedIn', 'false');
      window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_ORIGIN}/login`;
    } else if (response.status === 200) {
      // Update token if present in the response
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');
      }
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('Fetcher error:', error);
    throw error;
  }
};
