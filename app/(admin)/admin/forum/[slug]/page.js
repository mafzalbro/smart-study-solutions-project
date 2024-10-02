"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = ({ params: { slug } }) => {
    const router = useRouter()
    useEffect(() => {
      router.replace(`/forum/${slug}`);
    }, [router])
    
  return <p className="text-center my-10">redirecting to preview...</p>;
};

export default page;
