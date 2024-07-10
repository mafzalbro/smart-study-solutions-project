// layout.js
import React from 'react';
import NavBar from './components/NavBar';
import { AuthProvider } from '@/app/customHooks/AuthContext';
import './globals.css';
import Footer from './components/Footer';

export const metadata = {
  title: "Smart Study Solutions",
  description: "Let's learn anything about your degree",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
        
      <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
