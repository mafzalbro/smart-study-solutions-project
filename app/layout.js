import { Poppins, Outfit } from 'next/font/google';
import NavBar from '@/app/components/navbar/NavBar';
import { AuthProvider } from '@/app/customHooks/AuthContext';
// import { AppStateProvider } from '@/app/customHooks/AppStateProvider'; // Ensure this path is correct
import ProgressBar from '@/app/customHooks/ProgressBar'; // Import the provider
import './globals.css';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import { SkeletonTheme } from 'react-loading-skeleton';

export const metadata = {
  title: "Smart Study Solutions",
  description: "Let's learn anything about your degree",
};

const font = Outfit({ subsets: ["latin"], weight: ['400', '700'], display: "block" });

console.log('NEXT_PUBLIC_BACKEND_ORIGIN = ', process.env.NEXT_PUBLIC_BACKEND_ORIGIN);

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${font.className} text-primary dark:text-secondary`}>
      {/* <SkeletonTheme color="#eeeeee20" highlightColor="#44444420" baseColor='#eeeeee20'> */}
      <SkeletonTheme color="#eeeeee0" highlightColor="#44444410" baseColor='#eeeeee02'>
      <div className="gradient-skeleton">
      <ToastContainer stacked containerId={font.className} theme='dark'/>
        <AuthProvider>
          {/* <AppStateProvider> */}
            <ProgressBar>
              <NavBar />
              {children}
            </ProgressBar>
          {/* </AppStateProvider> */}
        </AuthProvider>
        <Footer />
        </div>
        </SkeletonTheme>
      </body>
    </html>
  );
};

export default RootLayout;
