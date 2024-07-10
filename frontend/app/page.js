"use client";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../app/styles/sliderStyles.css';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Hr from './components/Hr';
import Announcement from './components/Announcement';
import WhatWeOffer from './components/WhatWeOffer';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import ContactUs from './components/ContactUs';

const LandingPage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    // autoplaySpeed: 3000,
    // swipeToSlide: true,
  };

  return (
    <div className="container mx-auto my-20 p-10">
      <div className="flex flex-col md:flex-row items-center justify-center gap-20">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-bold font-mono">
            <span className="text-orange-600">Welcome PU Students,</span> You are At the Right Place!
          </h1>
          <p className="text-base w-4/6 md:mx-0 inline-block my-5">
            Discover, discuss, and learn with us. Join engaging conversations, ask questions, and share your knowledge across a wide range of topics.
            <span className="text-orange-600 font-semibold mt-2"> Start exploring and connecting today!</span>
          </p>
        </div>
        <div className="md:w-2/5 h[50vh]">
          <Slider {...settings}>
            <div>
              <Image
                src="https://images.pexels.com/photos/10141002/pexels-photo-10141002.jpeg"
                alt="AI Chatbot"
                layout="responsive"
                width={300}
                height={300}
                style={{ borderRadius: "34% 66% 9% 91% / 89% 24% 76% 11%" }}
              />
              <p className="text-center mt-2">AI Chatbot for personalized assistance</p>
            </div>
            <div>
              <Image
                src="https://images.pexels.com/photos/17556064/pexels-photo-17556064/free-photo-of-portrait-of-man-in-shirt.jpeg"
                alt="Q&A Forum"
                layout="responsive"
                width={300}
                height={300}
                style={{ borderRadius: "34% 66% 9% 91% / 89% 24% 76% 11%" }}
              />
              <p className="text-center mt-2">Structured Q&A Forum for organized learning</p>
            </div>
            <div className="flex items-center justify-center bg-orange-100 p-2 h-full">
              <Announcement />
            </div>
          </Slider>
        </div>
      </div>

      <Hr />

      <div>
        <WhatWeOffer />
      </div>

      {/* <Hr /> */}

      <div>
        
      <h2 className="text-4xl font-bold text-center mt-40 mb-24">Our Features</h2>
        <Features />
      </div>

      {/* <Hr /> */}

      <div>
      <h2 className="text-4xl font-bold text-center mt-40 mb-24">What Our Users Say</h2>
        <Testimonials />
      </div>

      {/* <Hr /> */}

      <div>
      <h2 className="text-4xl font-bold text-center mt-40 mb-24">Contact Us</h2>
        <ContactUs />
      </div>
    </div>
  );
};
export default LandingPage;
