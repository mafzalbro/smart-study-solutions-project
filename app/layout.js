// layout.js
import { Poppins, Outfit } from 'next/font/google'
import NavBar from '@/app/components/navbar/NavBar';
import { AuthProvider } from '@/app/customHooks/AuthContext';
import './globals.css';
import Footer from './components/Footer';

export const metadata = {
  title: "Smart Study Solutions",
  description: "Let's learn anything about your degree",
};

// const poppins = Poppins({ subsets: ["latin"], weight: ['400', '700'], display: "swap"});
const font = Outfit({ subsets: ["latin"], weight: ['400', '700'], display: "block"});

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      {/* <body className="font-sans"> */}
      <body className={`${font.className} bg-neutral-100 dark:bg-neutral-900`}>
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
