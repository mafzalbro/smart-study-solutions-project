"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourceCard from '@/app/components/resources/ResourceCard';
import Spinner from '@/app/components/Spinner';
import PdfModal from '@/app/components/resources/PdfModal';
import BookViewer from '@/app/components/resources/BookViewer';
import StylishTitle from '@/app/components/StylishTitle';
import Skeleton from 'react-loading-skeleton';
import Sidebar from '@/app/components/resources/Sidebar';
import { FaThumbsUp, FaThumbsDown, FaStar, FaChevronLeft } from 'react-icons/fa';
import { fetcher } from '@/app/utils/fetcher';

export default function ResourcePage({ params }) {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedResources, setRelatedResources] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  

  const { slug } = params;

  const updateResourceState = (updatedData) => {
    setResource((prevResource) => ({
      ...prevResource,
      ...updatedData,
    }));
    if (updatedData.likes !== undefined) setLikes(updatedData.likes);
    if (updatedData.dislikes !== undefined) setDislikes(updatedData.dislikes);
    if (updatedData.rating !== undefined) setRating(updatedData.rating);
    if (updatedData.ratingCount !== undefined) setRatingCount(updatedData.ratingCount);
    if (updatedData.hasLiked !== undefined) setHasLiked(updatedData.hasLiked);
    if (updatedData.hasDisliked !== undefined) setHasDisliked(updatedData.hasDisliked);
    if (updatedData.hasRated !== undefined) setHasRated(updatedData.hasRated);
  };

  const handleLike = async () => {
    try {
      const updatedResource = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/like`, 'POST');
      if (!updatedResource) {
        throw new Error('Failed to like resource');
      }

      updateResourceState(updatedResource);

      if(updatedResource.likes){
        setHasLiked(true)
        setHasDisliked(false)
      }
    } catch (error) {
      console.error('Error liking resource:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const updatedResource = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/dislike`, 'POST');
      if (!updatedResource) {
        throw new Error('Failed to dislike resource');
      }
      updateResourceState(updatedResource);
      if(updatedResource.dislikes){
        setHasLiked(false)
        setHasDisliked(true)
      }
    } catch (error) {
      console.error('Error disliking resource:', error);
    }
  };

  const handleRating = async (ratingValue) => {
    try {
      const updatedResource = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/rate`, 'POST', { rating: ratingValue });
      if (!updatedResource) {
        throw new Error('Failed to rate resource');
      }
      updateResourceState(updatedResource);
      
      if(updatedResource.rating) setHasRated(true)
    
  } catch (error) {
      console.error('Error rating resource:', error);
    }
  };

  
  useEffect(() => {
  const fetchResource = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const data = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}`);
      if (!data) {
        throw new Error('Failed to fetch resource data');
      }
      document.title = data.title;
      setResource(data);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setRating(data.rating);
      setHasLiked(data.hasLiked);
      setHasDisliked(data.hasDisliked);
      setHasRated(data.hasRated);
      setRatingCount(data.ratingCount);

      // Fetch related resources
      const relatedRes = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/recommend?resourceSlug=${slug}`);
      if (relatedRes) {
        setRelatedResources(relatedRes);
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

    fetchResource();
  }, [slug]);
  


  if (loading) {
    return <Skeleton height={1000} width="100%" />;
  }

  if (!resource) {
    return <p className="container mx-auto p-4 text-center text-neutral-700 dark:text-neutral-300">Resource not found</p>
  }

  return (
    <div className="resource-item container mx-auto w-[95vw] md:w-[90vw] my-10 px-4">
    <section className="flex flex-col md:flex-row gap-8">

      <main className="text-neutral-700 dark:text-neutral-300 bg-secondary dark:bg-neutral-800 shadow-md bg-clip-border rounded-lg p-6 md:p-10 flex-1">
        <Link href="/resources" className="text-accent-600 dark:text-accent-300 flex items-center">
          <FaChevronLeft className="mr-1" /> Back to Resources
        </Link>
        <div className="mt-4">
          <p className="text-neutral-700 dark:text-neutral-300 mb-2">
            <strong>Type:</strong>
            <Link href={`/resources/type/${resource.type.split(' ').join('-')}`} className="text-accent-500 hover:text-accent-600 dark:text-accent-300 transition-all duration-100 capitalize"> {resource.type} </Link>
          </p>
          <p className="text-neutral-700 dark:text-neutral-300 mb-2">
            <strong>Tags:</strong> {resource.tags.map((tag, i) => (
              <Link key={i} href={`/resources/tag/${tag.split(' ').join('-')}`} className="text-accent-500 hover:text-accent-600 dark:text-accent-300 transition-all duration-100 capitalize">
                {tag}{i < resource.tags.length - 1 && ', '}
              </Link>
            ))}
          </p>
          <p className="text-neutral-700 dark:text-neutral-300 mb-2">
            <strong>Published At:</strong> {new Date(resource.createdAt).toLocaleDateString()}
          </p>
          <p className="text-neutral-700 dark:text-neutral-300 mb-2">
            <strong>Updated At:</strong> {new Date(resource.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <h1 className="text-2xl md:text-4xl my-6 text-foreground">{resource.title}</h1>
        {resource.profileImage && (
          <img src={resource.profileImage} alt={resource.title} className="mb-4 w-full max-w-xs mx-auto" />
        )}
        <p className="mb-4 text-lg">{resource.description}</p>
        <div className="my-6 flex flex-col md:flex-row gap-4">
          {resource.pdfLink[0] && (
            <>
              <button
                onClick={() => setShowPdfModal(true)}
                className="bg-accent-600 text-white rounded-lg py-2 px-4 hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700"
              >
                View PDF
              </button>
              <button
                onClick={() => setShowBookModal(true)}
                className="bg-accent-600 text-white rounded-lg py-2 px-4 hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700"
              >
                View PDF as a Book
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={()=> handleLike()}
            disabled={hasLiked}
            className={`flex items-center text-neutral-700 dark:text-neutral-300 ${(hasLiked) ? 'text-blue-500' : ''} disabled:text-blue-500 dark:disabled:text-blue-500 disabled:pointer-events-none`}
          >
            <FaThumbsUp className="mr-2" /> {likes}
          </button>
          <button
            onClick={()=> handleDislike()}
            disabled={(hasDisliked)}
            className={`flex items-center disabled:text-red-500 dark:disabled:text-red-500 disabled:pointer-events-none text-neutral-700 dark:text-neutral-300 ${(hasDisliked) ? 'text-red-500' : ''}`}
          >
            <FaThumbsDown className="mr-2" /> {dislikes}
          </button>
        </div>
        <div>
          <h2 className="text-lg mb-2">Ratings: {rating.toFixed(2)} / 5 ({ratingCount} ratings)</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <button
                key={ratingValue}
                onClick={() => !hasRated && handleRating(ratingValue)}
                className={`flex items-center ${(hasRated) ? 'text-yellow-500' : 'text-neutral-500'} disabled:text-yellow-500 disabled:pointer-events-none`}
                disabled={(hasRated)}
              >
                <FaStar className="mr-1" />
              </button>
            ))}
          </div>
        </div>
        </main>

        <aside className="md:w-1/3">
          <Sidebar resources={relatedResources} />
        </aside>

        </section>


        {showPdfModal && (
          <PdfModal onClose={() => setShowPdfModal(false)} pdfLink={resource.pdfLink[0]} />
        )}

        {showBookModal && (
          <BookViewer onClose={() => setShowBookModal(false)} pdfLink={resource.pdfLink[0]} />
        )}

        </div>          
  )
};