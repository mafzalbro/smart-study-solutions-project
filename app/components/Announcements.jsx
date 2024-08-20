"use client";

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Announcement from '@/app/components/Announcement';
import '@/app/components/Announcements.css';
import { FaUserGraduate, FaCommentDots, FaCogs, FaPhone, FaEnvelope } from 'react-icons/fa';

const Announcements = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  // Slider settings
  const settings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Simulate data fetching
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // Set announcements data
        setAnnouncements([
          {
            title: "New Feature Release!",
            description: "We are excited to announce the launch of our new feature that allows you to customize your dashboard. Check it out and let us know what you think!",
            btnText: "Learn More",
            btnLink: "/features/custom-dashboard",
            icon: <FaCogs className="text-2xl text-secondary" />
          },
          {
            title: "Maintenance Scheduled",
            description: "We will be performing scheduled maintenance on our servers on July 15th from 2:00 AM to 4:00 AM. During this time, the website may be temporarily unavailable.",
            btnText: "Read More",
            btnLink: "/maintenance",
            icon: <FaCogs className="text-2xl text-secondary" />
          },
          {
            title: "Summer Sale is Here!",
            description: "Enjoy up to 50% off on all products during our Summer Sale! Don't miss out on these amazing deals.",
            btnText: "Shop Now",
            btnLink: "/sale",
            icon: <FaCommentDots className="text-2xl text-secondary" />
          },
          {
            title: "Webinar on Digital Marketing",
            description: "Join us for a free webinar on digital marketing strategies on August 5th at 10:00 AM. Reserve your spot today!",
            btnText: "Register Now",
            btnLink: "/webinar/digital-marketing",
            icon: <FaUserGraduate className="text-2xl text-secondary" />
          },
          {
            title: "Holiday Hours Update",
            description: "Please note that our office will be closed for the holidays from December 24th to January 1st. We will resume normal business hours on January 2nd.",
            btnText: "See Details",
            btnLink: "/holiday-hours",
            icon: <FaEnvelope className="text-2xl text-secondary" />
          },
          {
            title: "New Blog Post",
            description: "Check out our latest blog post on the top 10 productivity tips to boost your workflow. Get inspired and enhance your efficiency!",
            btnText: "Read Blog",
            btnLink: "/blog/productivity-tips",
            icon: <FaCommentDots className="text-2xl text-secondary" />
          },
          {
            title: "Customer Appreciation Week",
            description: "To show our gratitude, we're offering special discounts and giveaways all week long. Thank you for being a valued customer!",
            btnText: "Explore Offers",
            btnLink: "/customer-appreciation",
            icon: <FaPhone className="text-2xl text-secondary" />
          }
        ]);
        setLoading(false);
      } catch (error) {
        // Handle error
        console.error(error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col bg-white dark:bg-accent-900 p-6 rounded-lg text-center my-auto w-[90vw] md:w-full">
        <Skeleton 
          height={40}
          width={200} 
          className="mb-2 md:w-48 w-32"
        />
        <Skeleton 
          height={80} 
          width={300} 
          className="mb-4 md:w-64 w-48"/>
        <Skeleton 
          height={30} 
          width={150} 
          className="md:w-36 w-28"
        />
      </div>
    );
  }
  

  return (
    <Slider {...settings}>
      {announcements.map((announcement, index) => (
        <Announcement key={index} data={announcement} />
      ))}
    </Slider>
  );
};

export default Announcements;
