import { Poppins, Outfit } from 'next/font/google';
import NavBar from '@/app/components/navbar/NavBar';
import { AuthProvider } from '@/app/customHooks/AuthContext';
// import { AppStateProvider } from '@/app/customHooks/AppStateProvider'; // Ensure this path is correct
import ProgressBar from '@/app/customHooks/ProgressBar'; // Import the provider
import './globals.css';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';

export const metadata = {
  title: "Smart Study Solutions",
  description: "Let's learn anything about your degree",
};

const font = Outfit({ subsets: ["latin"], weight: ['400', '700'], display: "block" });

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${font.className}`}>
      <ToastContainer stacked containerId={font.className}/>
        <AuthProvider>
          {/* <AppStateProvider> */}
            <ProgressBar>
              <NavBar />
              {children}
            </ProgressBar>
          {/* </AppStateProvider> */}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
