"use client"

import NewsletterSubscription from "./NewsletterSubscription";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import { getPathFromReferer } from "@/app/services/server/server";
import { usePathname } from "next/navigation";

// const Footer = async () => {
const Footer = () => {
  const pathname = usePathname();
  // const pathname = await getPathFromReferer();

  // If the pathname includes "/chat", do not render the footer
  if (pathname?.includes("/chat")) {
    return null;
  }

  return (
    <footer className="bg-neutral-800 text-neutral-100 p-6 text-center">
      <div className="flex flex-col items-center mt-6 mb-10">
        <NewsletterSubscription />
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-neutral-200">Smart Study Solutions</h2>
            <p className="mb-4 text-neutral-400">Your go-to platform for academic resources and support.</p>
            <div className="flex items-center justify-center">
            <div className="flex space-x-4 text-neutral-400">
              <Link href="https://facebook.com" className="hover:text-neutral-200">
                <FaFacebookF />
              </Link>
              <Link href="https://twitter.com" className="hover:text-neutral-200">
                <FaTwitter />
              </Link>
              <Link href="https://instagram.com" className="hover:text-neutral-200">
                <FaInstagram />
              </Link>
              <Link href="https://linkedin.com" className="hover:text-neutral-200">
                <FaLinkedinIn />
              </Link>
            </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-200">Useful Links</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/" className="hover:text-neutral-200">Home</Link></li>
              <li><Link href="/resources" className="hover:text-neutral-200">Study Material</Link></li>
              <li><Link href="/forum" className="hover:text-neutral-200">QnA Forum</Link></li>
              <li><Link href="/chat" className="hover:text-neutral-200">AI Chat</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-200">Quick Links</h3>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/contact" className="hover:text-neutral-200">Contact</Link></li>
              <li><Link href="/about" className="hover:text-neutral-200">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Smart Study Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
