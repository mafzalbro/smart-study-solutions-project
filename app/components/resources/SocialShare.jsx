"use client";

import React from "react";
import PropTypes from "prop-types";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from "react-share";

import {
  AiFillFacebook,
  AiOutlineTwitter,
  AiFillLinkedin,
  AiOutlineWhatsApp,
  AiOutlineMail,
} from "react-icons/ai";

const defaultIcons = {
  Facebook: AiFillFacebook,
  Twitter: AiOutlineTwitter,
  LinkedIn: AiFillLinkedin,
  WhatsApp: AiOutlineWhatsApp,
  Email: AiOutlineMail,
};

const SocialShare = ({
  url,
  title,
  customIcons,
  buttonSize = "w-8 h-8",
}) => {
  const customStyles = {
    Facebook: "text-blue-600",
    Twitter: "text-blue-400",
    LinkedIn: "text-blue-800",
    WhatsApp: "text-green-500",
    Email: "text-gray-500",
  };

  const platformButtons = [
    {
      name: "Facebook",
      Button: FacebookShareButton,
      icon: defaultIcons.Facebook,
      style: customStyles?.Facebook || "text-blue-600",
    },
    {
      name: "Twitter",
      Button: TwitterShareButton,
      icon: defaultIcons.Twitter,
      style: customStyles?.Twitter || "text-blue-400",
    },
    {
      name: "LinkedIn",
      Button: LinkedinShareButton,
      icon: defaultIcons.LinkedIn,
      style: customStyles?.LinkedIn || "text-blue-700",
    },
    {
      name: "WhatsApp",
      Button: WhatsappShareButton,
      icon: defaultIcons.WhatsApp,
      style: customStyles?.WhatsApp || "text-green-500",
    },
    {
      name: "Email",
      Button: EmailShareButton,
      icon: defaultIcons.Email,
      style: customStyles?.Email || "text-gray-700",
    },
  ];

  // Merge default icons with custom ones
  const mergedIcons = { ...defaultIcons, ...customIcons };

  return (
    <div className="flex items-center gap-4 fixed right-2 flex-col top-20 sm:top-40">
      <span className="text-sm">Share</span>
      {platformButtons.map(({ name, Button, icon, style }) => {
        const IconComponent = mergedIcons[name] || icon;
        return (
          <Button
            key={name}
            url={url}
            title={title}
            className={`flex items-center shadow-lg justify-center ${buttonSize} rounded-full bg-gray-100 hover:bg-gray-200 transition-all`}
          >
            <IconComponent className={style} />
          </Button>
        );
      })}
    </div>
  );
};

SocialShare.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  customIcons: PropTypes.object, // Override default icons
  buttonSize: PropTypes.string, // TailwindCSS size classes for buttons
  customStyles: PropTypes.object, // Additional styles for each platform
};

export default SocialShare;
