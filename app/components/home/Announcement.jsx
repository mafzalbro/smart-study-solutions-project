import React from "react";
import LinkButton from "../LinkButton";
import StylishSpan from "../StylishSpan";
import StylishTitle from "../StylishTitle";

const Announcement = ({ data, index }) => {
  // Alternating image position based on the index
  const imageOnLeft = index % 2 === 0; // Even index: Image on the left, odd index: Image on the right

  return (
    <>
      {data && (
        <div className="relative flex flex-col md:flex-row min-h-[80vh] md:h-[80vh] w-full overflow-hidden mb-4">
          {/* Full Background Image Section */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 blur-md"
            style={{
              backgroundImage: `url(${
                data.image ? data.image : "/resources/header.png"
              })`,
              zIndex: -1, // Place the full background image behind the content
            }}
          ></div>

          {/* Image Section (Visible as Content Image) */}
          <div
            className={`w-full md:w-1/2 h-full ${
              imageOnLeft ? "order-1 md:order-1" : "order-2 md:order-2"
            } flex justify-center items-center p-8`}
          >
            <img
              src={data.image ? data.image : "/resources/header.png"}
              alt="Announcement"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Content Section */}
          <div
            className={`relative flex flex-col justify-center  p-10 md:w-1/2 h-full z-10 ${
              imageOnLeft
                ? "order-2 md:order-2 text-right items-end"
                : "order-1 md:order-1 text-left items-start"
            }`}
          >
            {data.title && (
              <StylishTitle
                tagName="h2"
                colored={data.title}
                className="text-3xl sm:text-4xl font-extrabold mb-4"
              />
            )}
            {data.description && (
              <p className="mb-6 leading-relaxed my-5">{data.description}</p>
            )}
            {data.btnLink && (
              <LinkButton
                link={data.btnLink}
                text={data.btnText}
                icon={data.icon}
                className="transform transition-all duration-300 hover:scale-105"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Announcement;
