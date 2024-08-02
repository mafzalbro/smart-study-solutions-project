import React from 'react';
import Slider from 'react-slick';

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="my-16">
      <Slider {...settings}>
        <div className="p-6">
          <p className="text-lg italic">"Smart Study Solutions has transformed my study habits. The AI Chatbot is incredibly helpful!"</p>
          <span className="block mt-4 text-right font-semibold">- Student A</span>
        </div>
        <div className="p-6">
          <p className="text-lg italic">"The Q&A Forum allows me to get answers quickly and the community is very supportive."</p>
          <span className="block mt-4 text-right font-semibold">- Student B</span>
        </div>
        <div className="p-6">
          <p className="text-lg italic">"Notifications keep me updated on the latest resources. It's a game changer!"</p>
          <span className="block mt-4 text-right font-semibold">- Student C</span>
        </div>
      </Slider>
    </div>
  );
};

export default Testimonials;
