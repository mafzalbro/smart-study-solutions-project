"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const fetcher = async (url, method = 'GET', body = null, headers = {}) => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };


  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  if (response.status === 401 && !token && !path.includes('/resources') && path !== new URL(process.env.NEXT_PUBLIC_FRONTEND_ORIGIN).pathname) {
    router.push('/login');
  } else if (response.status === 200 && (path.includes('/login') || path.includes('/login/google') || path.includes('/register') || path.includes('/register/google'))) {
    router.push('/');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
