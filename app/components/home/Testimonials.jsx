"use client";

import React from "react";
import Slider from "react-slick";
import { FaQuoteLeft, FaQuoteRight, FaMale, FaFemale } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/app/styles/sliderStyles.css";

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

  // Amazing Testing Data for Testimonials
  const testimonials = [
    {
      quote:
        "Smart Study Solutions has completely transformed my study habits. The AI Chatbot is incredibly helpful in providing personalized answers. I can study smarter, not harder!",
      author: "Sarah Thompson",
      gender: "female",
      location: "California, USA",
      profession: "University Student",
    },
    {
      quote:
        "As a working professional, time is precious. The Q&A Forum allows me to get answers quickly, and the community is always supportive and knowledgeable. It’s been a game changer!",
      author: "John Doe",
      gender: "male",
      location: "New York, USA",
      profession: "Software Engineer",
    },
    {
      quote:
        "The notifications feature keeps me updated on the latest resources. I never miss out on valuable learning materials. It's truly a game changer for my continuous learning!",
      author: "Emily Wang",
      gender: "female",
      location: "Sydney, Australia",
      profession: "Content Writer",
    },
    {
      quote:
        "I have seen a significant improvement in my study efficiency, thanks to Smart Study Solutions. The resources are relevant, and the community support is outstanding!",
      author: "Michael Lee",
      gender: "male",
      location: "Toronto, Canada",
      profession: "Marketing Specialist",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        What Our Users Are Saying
      </h2>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="px-4">
            <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
              <div className="flex items-center justify-center mb-6">
                <FaQuoteLeft className="text-4xl text-accent-600 mr-2" />
                <p className="text-2xl !font-extralight text-primary dark:text-secondary max-w-xl mx-auto">
                  {testimonial.quote}
                </p>
                <FaQuoteRight className="text-4xl text-accent-600 ml-2" />
              </div>
              <div className="flex flex-col items-center justify-center mt-8">
                {testimonial.gender === "female" ? (
                  <FaFemale className="text-accent-600 text-4xl mb-2" />
                ) : (
                  <FaMale className="text-accent-600 text-4xl mb-2" />
                )}
                <span className="text-accent-500 text-lg font-semibold">
                  {testimonial.author}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                  {testimonial.profession} from {testimonial.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
