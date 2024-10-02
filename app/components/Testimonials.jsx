"use client"

import React from 'react';
import Slider from 'react-slick';
import { SlUserFemale, SlUser } from "react-icons/sl";
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/app/styles/sliderStyles.css'; // Adjust the path as necessary

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  const testimonials = [
    {
      quote: "Smart Study Solutions has transformed my study habits. The AI Chatbot is incredibly helpful!",
      author: "Student A",
      gender: "female"
    },
    {
      quote: "The Q&A Forum allows me to get answers quickly and the community is very supportive.",
      author: "Student B",
      gender: "male"
    },
    {
      quote: "Notifications keep me updated on the latest resources. It's a game changer!",
      author: "Student C",
      gender: "female"
    }
  ];

  return (
    <>
      <Slider {...settings} >
        {testimonials.map((testimonial, index) => (
          <div  key={index} className="px-2">
          <div className="bg-secondary dark:bg-neutral-800 p-6 rounded-lg text-center my-auto">
            <div className="flex items-center justify-center mb-4">
              <FaQuoteLeft className="text-3xl text-accent-600 mr-2" />
              <p className="text-lg italic text-primary dark:text-secondary text-center">{testimonial.quote}</p>
              <FaQuoteRight className="text-3xl text-accent-600 ml-2" />
            </div>
            <div className="flex items-center justify-end mt-8">
              {testimonial.gender === "female" ? <SlUserFemale className="text-accent-600 mr-2" /> : <SlUser className="text-accent-600 mr-2" />}
              <span className="text-accent-500 text-sm">{testimonial.author}</span>
            </div>
          </div>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default Testimonials;
