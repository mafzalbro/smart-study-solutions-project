"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ResourceCard from '@/app/components/ResourceCard';
import Spinner from '@/app/components/Spinner';
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';

export default function ResourcePage({ params }) {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedResources, setRelatedResources] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const { slug } = params;

  useEffect(() => {
    const fetchResource = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}`, {
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error('Failed to fetch resource data');
        }
        const data = await res.json();
        document.title = data.title;
        setResource(data);
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setRating(data.rating);
        setRatingCount(data.ratingCount);

        // Fetch related resources
        const relatedRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/recommend`, {
          credentials: 'include'
        });
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedResources(relatedData);
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [slug]);

  const updateResourceState = (updatedData) => {
    setResource((prevResource) => ({
      ...prevResource,
      ...updatedData,
    }));
    if (updatedData.likes !== undefined) setLikes(updatedData.likes);
    if (updatedData.dislikes !== undefined) setDislikes(updatedData.dislikes);
    if (updatedData.rating !== undefined) setRating(updatedData.rating);
    if (updatedData.ratingCount !== undefined) setRatingCount(updatedData.ratingCount);
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to like resource');
      }
      const updatedResource = await res.json();
      updateResourceState(updatedResource);
    } catch (error) {
      console.error('Error liking resource:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/dislike`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to dislike resource');
      }
      const updatedResource = await res.json();
      updateResourceState(updatedResource);
    } catch (error) {
      console.error('Error disliking resource:', error);
    }
  };

  const handleRating = async (ratingValue) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: ratingValue }),
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to rate resource');
      }
      const updatedResource = await res.json();
      updateResourceState(updatedResource);
    } catch (error) {
      console.error('Error rating resource:', error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!resource) {
    return <p className="container mx-auto p-4 text-center text-gray-700">Resource not found</p>;
  }

  return (
    <div className="container mx-auto w-[80vw] sm:w-[95vw]">
      <div className='text-gray-700 bg-white shadow-md bg-clip-border rounded-xl mt-10 p-10'>
        <Link href="/resources">
          <span className="block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-sm hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700">
            &larr; &nbsp; Back to Resources
          </span> 
        </Link>
        <div className='flex space-x-4 mt-10 font-sans'>
          <p className="text-gray-700 mb-2"><strong>Type:</strong> {resource.type}</p>
          <p className="text-gray-700 mb-2"><strong>Tags:</strong> {resource.tags.join(', ')}</p>
          <p className="text-gray-700 mb-2"><strong>Published At:</strong> {new Date(resource.created_at).toLocaleDateString()}</p>
          <p className="text-gray-700 mb-2"><strong>Updated At:</strong> {new Date(resource.updated_at).toLocaleDateString()}</p>
        </div>
        <div className="flex">
          <div className="w-full lg:w-3/4">
            <h1 className="text-5xl font-bold my-16 text-foreground font-mono">{resource.title}</h1>
            {resource.profileImage && (
              <img src={resource.profileImage} alt={resource.title} className="mb-4" />
            )}
            <p className="block mb-2 font-sans text-xl antialiased leading-snug tracking-normal text-blue-gray-900 font-normal">{resource.description}</p>
            {resource.pdfLink[0] && (
              <a href={resource.pdfLink[0]} target='_blank' rel='noopener noreferrer' className="block md:inline-block py-2 px-4 bg-orange-600 text-white rounded-lg shadow-sm hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700">
                Checkout PDF
              </a> 
            )}
            <div className="flex items-center my-20 space-x-4">
              <button onClick={handleLike} className="flex items-center text-gray-700">
                <FaThumbsUp className="mr-2" /> {likes}
              </button>
              <button onClick={handleDislike} className="flex items-center text-gray-700">
                <FaThumbsDown className="mr-2" /> {dislikes}
              </button>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-sans mb-2">Ratings: {rating.toFixed(2)} / 5 ({ratingCount} ratings)</h2>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((ratingValue) => (
                  <button
                    key={ratingValue}
                    onClick={() => handleRating(ratingValue)}
                    className="mr-1 flex items-center text-gray-700"
                  >
                    <FaStar className={`mr-1 ${Math.round(rating) >= ratingValue ? 'text-yellow-500' : 'text-gray-300'}`} />
                      {/* {ratingValue} */}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {relatedResources.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center my-16 text-foreground font-mono">Related Resources</h2>
          <div className="flex justify-center gap-2 my-10">
            {relatedResources.map((related) => (
              <ResourceCard key={related._id} resource={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
