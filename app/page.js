import React from "react";
import Hr from "./components/Hr";
import WhatWeOffer from "./components/home/WhatWeOffer";
import GetStartedButtons from "./components/GetStartedButtons";
import Features from "./components/home/Features";
import Testimonials from "./components/home/Testimonials";
import ContactUs from "./components/ContactUs";
// import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Announcements from "./components/home/Announcements";
import MainHeading from "./components/MainHeading.jsx";
// import StylishTitle from "./components/StylishTitle";
// import StylishSpan from "./components/StylishSpan";
import RecommendationsForYou from "./components/home/Recommendations";
import AnnouncementStripe from "./components/home/Stripe";

const LandingPage = () => {
  return (
    <div>
      <Announcements />

      <div className="container mx-auto md:my-20">
        {/* <Hr /> */}

        <div>
          <WhatWeOffer />
        </div>

        <div>
          <RecommendationsForYou />
        </div>

        <div>
          <MainHeading name="Features" />
          <Features />
        </div>

          <AnnouncementStripe />
          
        <div>
          <MainHeading name="Testimonials" />
          <Testimonials />
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-20 mx-5 mb-20">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10 p-4">
            <MainHeading name="Contact Us" />
            <ContactUs />
          </div>
          <div
            className="w-full hidden md:block md:w-1/2 h-[70vh] bg-cover bg-center"
            style={{
              backgroundImage: "url('/home/contact.png')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
