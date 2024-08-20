"use client";

export const fetcher = async (url, method = 'GET', body = null, headers = {}) => {
  const token = localStorage.getItem('token'); // Get token from local storage
  const path = window.location.pathname;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Include token in headers
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (response.status === 401 && !path.includes('/resources') && path !== new URL(process.env.NEXT_PUBLIC_FRONTEND_ORIGIN).pathname) {
    localStorage.removeItem('token'); // Remove token on unauthorized access
    window.location.replace(`${process.env.NEXT_PUBLIC_FRONTEND_ORIGIN}/login`);
  } else if (response.status === 200 && (path.includes('/login') || path.includes('/login/google') || path.includes('/register') || path.includes('/register/google'))) {
    window.location.replace('/');
  }

  const data = await response.json();

  console.log({ data, status: response.status });

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  // Store new token if available in the response body
  if (data.token) {
    localStorage.setItem('token', data.token); // Store token
  }

  return data;
};
