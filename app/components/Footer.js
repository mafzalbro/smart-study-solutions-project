"use client"

import { usePathname } from "next/navigation";
import NewsletterSubscription from "./NewsletterSubscription";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();

  // If the pathname includes "/chat", do not render the footer
  if (pathname.includes("/chat")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white p-5">
      <div className="flex justify-center items-center flex-col mt-5 mb-10 bg-gray-800">
      <NewsletterSubscription />
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Smart Study Solutions</h2>
            <p className="mb-4 text-gray-400">Your go-to platform for academic resources and support.</p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-gray-400 hover:text-white">
                <FaFacebookF />
              </Link>
              <Link href="https://twitter.com" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </Link>
              <Link href="https://instagram.com" className="text-gray-400 hover:text-white">
                <FaInstagram />
              </Link>
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-white">
                <FaLinkedinIn />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/resources" className="hover:text-white">Study Material</Link></li>
              <li><Link href="/forum" className="hover:text-white">QnA Forum</Link></li>
              <li><Link href="/chat" className="hover:text-white">AI Chat</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Smart Study Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
