"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourceCard from '@/app/components/resources/ResourceCard';
import Spinner from '@/app/components/Spinner';
import PdfModal from '@/app/components/resources/PdfModal';
import { FaThumbsUp, FaThumbsDown, FaStar, FaBackward, FaChevronLeft } from 'react-icons/fa';
import { fetcher } from '@/app/utils/fetcher';
import StylishTitle from '@/app/components/StylishTitle';
import Skeleton from 'react-loading-skeleton';
import Sidebar from '@/app/components/resources/Sidebar';
import BookViewer from '@/app/components/resources/BookViewer';


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
  const { slug } = params;

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
      const updatedResource = await fetcher(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/resources/${slug}/like`, 'POST');
      if (!updatedResource) {
        throw new Error('Failed to like resource');
      }
      updateResourceState(updatedResource);
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
    } catch (error) {
      console.error('Error rating resource:', error);
    }
  };

  if (loading) {
    return <Skeleton height={1000} width="100%"/>
  }
  // if (loading) {
  //   return <div className='h-[52vh] flex items-center justify-center'>
  //       <Skeleton height={500} count={5} width="100%"/>
  //   </div>
  // }

  if (!resource) {
    return <p className="container mx-auto p-4 text-center text-neutral-700 dark:text-neutral-300">Resource not found</p>
  }

  return (
    <div className="resource-item container mx-auto w-[95vw] md:w-[90vw] mb-10">
      <section className='flex gap-8 flex-col md:flex-row'>

      <main className='text-neutral-700 md:w-[66%] dark:text-neutral-300 bg-secondary dark:bg-neutral-800 shadow-md bg-clip-border rounded-lg mt-10 p-10'>
        <Link href="/resources" className='text-accent-600 dark:text-accent-300'>
          {/* <span className="block md:inline-block py-2 px-4 bg-accent-600 text-white rounded-lg shadow-sm hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700"> */}
            <FaChevronLeft className='mr-1 inline-block'/> Back to Resources
          {/* </span>  */}
        </Link>
        <div className='flex space-x-4 mt-10'>
          <p className="text-neutral-700 dark:text-neutral-300 mb-2"><strong>Type:</strong>
          <Link href={`/resources/type/${resource?.type?.split(' ').join('-')}`} className='text-accent-500 hover:text-accent-600 dark:text-accent-300 transition-all duration-100 capitalize'> {resource?.type} </Link>
          </p>

          <p className="text-neutral-700 dark:text-neutral-300 mb-2"><strong>Tags:</strong> {resource?.tags.map((tag, i) => <Link key={i} href={`/resources/tag/${tag?.split(' ').join('-')}`} className='text-accent-500 hover:text-accent-600 dark:text-accent-300 transition-all duration-100 capitalize' tabIndex={1}>{tag}{resource?.tags[resource?.tags.length - 1] !== tag && ','} </Link>)}</p>

          
          <p className="text-neutral-700 dark:text-neutral-300
mb-2"><strong>Published At:</strong> {new Date(resource?.createdAt).toLocaleDateString()}</p>

      <p className="text-neutral-700 dark:text-neutral-300 mb-2"><strong>Updated At:</strong> {new Date(resource?.updatedAt).toLocaleDateString()}</p>
    </div>
    <div className="flex">
      <div className="w-full lg:w-3/4">
        <h1 className="text-5xl my-16 text-foreground">{resource?.title}</h1>
        {resource?.profileImage && (
          <img src={resource?.profileImage} alt={resource?.title} className="mb-4" />
        )}
        <p className="block mb-2 text-xl antialiased leading-snug tracking-normal text-blue-gray-900 font-normal">{resource?.description}</p>

        <p className='my-10'>
        {resource?.pdfLink[0] && (
          <button
          onClick={() => setShowPdfModal(true)}
          className="block md:inline-block py-2 px-4 bg-accent-600 text-white rounded-lg shadow-sm hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700 mr-2"
          >
            View PDF
          </button> 
        )}

        {resource?.pdfLink[0] && (
          <button
          onClick={() => setShowBookModal(true)}
          className="block md:inline-block py-2 px-4 bg-accent-600 text-white rounded-lg shadow-sm hover:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700"
          >
            View PDF as a Book
          </button> 
        )}

        </p>


        <div className="flex items-center my-20 space-x-4">
          <button onClick={handleLike} className="flex items-center text-neutral-700 dark:text-neutral-300">
            <FaThumbsUp className="mr-2" /> {likes}
          </button>
          <button onClick={handleDislike} className="flex items-center text-neutral-700 dark:text-neutral-300">
            <FaThumbsDown className="mr-2" /> {dislikes}
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-lg mb-2">Ratings: {rating.toFixed(2)} / 5 ({ratingCount} ratings)</h2>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((ratingValue) => (
              <button
                key={ratingValue}
                onClick={() => handleRating(ratingValue)}
                className="mr-1 flex items-center text-neutral-700 dark:text-neutral-300"
              >
                <FaStar className={`mr-1 ${Math.round(rating) >= ratingValue ? 'text-yellow-500' : 'text-gray-300'}`} />
                  {/* {ratingValue} */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </main>
     <Sidebar />
  </section>
  {relatedResources.length > 0 && (
    <div className="mt-8">
      <StylishTitle colored='Related Resources' tagName='h2' fontSize='3xl' className='text-center'/>
      <div className="flex flex-col sm:flex-row justify-center gap-2 my-10">
        {relatedResources.map((related) => (
          <ResourceCard key={related._id} resource={related} />
        ))}
      </div>
    </div>
  )}
  {showPdfModal && (
    <div className='mx-auto'>
    <PdfModal
      fileUrl={resource.pdfLink[0]}
      onClose={() => setShowPdfModal(false)}
      />
      </div>
  )}
  {showBookModal && (
    <div className='fixed flex justify-center top-0 left-0 bg-primary bg-opacity-80 w-full h-screen'>
      
      <BookViewer
      pdfUrl={resource?.pdfLink[0]} 
      onClose={() => setShowBookModal(false)}
      />
      </div>
  )}
</div>
);
}

