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

const LandingPage = () => {
  return (
    <div className="container mx-auto mt-20 md:my-20">
      <div className="flex flex-col md:flex-row items-center justify-center gap-20">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl leading-tight">
            <span className="text-accent-500">Hey PU Buddy,</span> <br/> You are At the Right Place!
          </h1>
          <div className="text-base w-4/6 md:mx-0 inline-block my-5">
            Discover, discuss, and learn with us. Join engaging conversations, ask questions.
            <span className="text-accent-500"> Start exploring and connecting today!</span>
            <p className='mt-8'>
            <GetStartedButtons />
            </p>
          </div>
        </div>
        <div className="md:w-2/5">
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
        <MainHeading name='What Our Users Say' />
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
