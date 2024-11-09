import { Poppins, Outfit } from "next/font/google";
import NavBar from "@/app/components/navbar/NavBar";
import { AuthProvider } from "@/app/customHooks/AuthContext";
// import { AppStateProvider } from '@/app/customHooks/AppStateProvider'; // Ensure this path is correct
import ProgressBar from "@/app/customHooks/ProgressBar"; // Import the provider
import "./globals.css";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Smart Study Solutions",
  description: "Let's learn anything about your degree",
};

const font = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "block",
});

console.log(
  "NEXT_PUBLIC_BACKEND_ORIGIN = ",
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN
);

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${font.className} text-primary dark:text-secondary`}>
        {/* <SkeletonTheme color="#eeeeee20" highlightColor="#44444420" baseColor='#eeeeee20'> */}
        <SkeletonTheme
          color="#eeeeee0"
          highlightColor="#44444410"
          baseColor="#eeeeee02"
        >
          <div className="gradient-skeleton">
            <AuthProvider>
              {/* <AppStateProvider> */}
              <ProgressBar>
                <NavBar />
                <ToastContainer
                  stacked
                  position="bottom-center"
                  draggable
                  newestOnTop
                  pauseOnHover
                  autoClose
                  containerId={font.className}
                  theme="dark"
                />
                {children}
              </ProgressBar>
              {/* </AppStateProvider> */}
              <Footer />
            </AuthProvider>
          </div>
        </SkeletonTheme>
      </body>
    </html>
  );
};

export default RootLayout;
