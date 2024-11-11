"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "react-loading-skeleton/dist/skeleton.css";
import Announcement from "@/app/components/home/Announcement";
import "@/app/components/home/Announcements.css";
import { fetcher } from "@/app/utils/fetcher";
import AnnouncementSkeleton from "./AnnouncementSkeleton";
import AnnouncementHardCoded from "./AnnouncementHardCoded";

const Announcements = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  // Slider settings
  const settings = {
    // dots: true,
    // fade: true,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await fetcher(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/api/announcements`
        );

        // Set announcements data
        setAnnouncements(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <AnnouncementSkeleton />;
  }

  return (
    <div className="min-h-[80vh] md:h-[80vh]">
      {announcements.length !== 0 ? (
        <Slider {...settings}>
          <AnnouncementHardCoded />
          {announcements.map((announcement, index) => (
            <Announcement key={index} data={announcement} index={index} />
          ))}
        </Slider>
      ) : (
        <AnnouncementHardCoded />
      )}
    </div>
  );
};

export default Announcements;
