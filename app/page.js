import React from 'react';
import Hr from './components/Hr';
import WhatWeOffer from './components/WhatWeOffer';
import GetStartedButtons from './components/GetStartedButtons';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import ContactUs from './components/ContactUs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Announcements from './components/Announcements';
import MainHeading from './components/MainHeading.jsx';
import StylishTitle from './components/StylishTitle';
import StylishSpan from './components/StylishSpan';

const LandingPage = () => {
  return (
    <div className="container mx-auto mt-5 md:my-20">
      <div className="flex flex-col md:flex-row items-center justify-center gap-20">
        <div className="md:w-1/2 text-center md:text-left">

          {/* <StylishTitle colored='Hey PU Buddy,' addBr simple='You are At the Right Place!' /> */}

          {/* <div className="text-base w-5/6 md:mx-0 inline-block my-5">
            Discover, discuss, and learn with us. Join engaging conversations, ask questions.
            <StylishSpan> Start exploring and connecting today!</StylishSpan>
            <span className='mt-8 block'>
            <GetStartedButtons />
            </span>
          </div> */}

          <StylishTitle colored='The Ultimate Destination ' addBr simple='for Your Smart Studies!' />

          <div className="text-base w-5/6 md:mx-0 inline-block my-5">
              Here you'll find all the solutions about your study problems!
            <span className='mt-8 block'>
            <GetStartedButtons />
            </span>
          </div>
        </div>
        <div className="w-full md:w-2/5">
          <Announcements />
        </div>
      </div>

      {/* <Hr /> */}

      <div>
        <WhatWeOffer />
      </div>

      <div>
        <MainHeading name='What We Offer' />
        <Features />
      </div>

      <div>
        <MainHeading name='Testimonials' />
        <Testimonials />
      </div>

      <div className='md:mx-36 mb-20 mx-5'>
        <MainHeading name='Contact Us' />
        <ContactUs />
      </div>
    </div>
  );
};

export default LandingPage;
