"use client";

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Announcement from '@/app/components/Announcement';
import '@/app/components/Announcements.css';
import { FaBookOpen, FaFileAlt, FaTags, FaChalkboardTeacher, FaClock, FaBook, FaGift } from 'react-icons/fa';

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
            title: "New Notes Released!",
            description: "We have just added new lecture notes for the latest courses. Make sure to download them and stay updated.",
            btnText: "View Notes",
            btnLink: "/notes/latest",
            icon: <FaBookOpen className="text-2xl text-secondary" />
          },
          {
            title: "Past Papers Available",
            description: "Past exam papers for all subjects are now available. Start practicing and boost your preparation!",
            btnText: "Access Papers",
            btnLink: "/past-papers",
            icon: <FaFileAlt className="text-2xl text-secondary" />
          },
          {
            title: "Textbook Discounts!",
            description: "Enjoy up to 30% off on textbooks and reference materials this semester. Don't miss out on these deals.",
            btnText: "Shop Now",
            btnLink: "/books/sale",
            icon: <FaTags className="text-2xl text-secondary" />
          },
          {
            title: "Study Webinar Series",
            description: "Join our upcoming webinar series focused on study techniques and time management. Reserve your spot today!",
            btnText: "Register Now",
            btnLink: "/webinars/study-techniques",
            icon: <FaChalkboardTeacher className="text-2xl text-secondary" />
          },
          {
            title: "Library Hours Update",
            description: "The university library will have extended hours during exam week. Check the schedule for more details.",
            btnText: "See Schedule",
            btnLink: "/library/hours",
            icon: <FaClock className="text-2xl text-secondary" />
          },
          {
            title: "New Book Arrivals",
            description: "Explore the latest arrivals in our book collection. From reference guides to the latest research publications.",
            btnText: "Browse Books",
            btnLink: "/books/new-arrivals",
            icon: <FaBook className="text-2xl text-secondary" />
          },
          {
            title: "Student Appreciation Week",
            description: "Celebrate Student Appreciation Week with exclusive access to study materials and giveaways.",
            btnText: "Explore Offers",
            btnLink: "/student-appreciation",
            icon: <FaGift className="text-2xl text-secondary" />
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
      <div className="flex justify-center items-center flex-col bg-white dark:bg-accent-900 p-6 rounded-lg text-center mx-auto w-[90vw] md:w-full">
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
