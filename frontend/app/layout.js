// app/layout.js
// import { Inter } from "next/font/google";
import NavBar from "./components/NavBar";
import AuthCheck from "./customHooks/useAuth";
import "./globals.css";


// const inter = Inter({ subsets: ["greek"] });

export const metadata = {
  title: "Smart Study Solutions",
  description: "Let's learn anything about your degreen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body className="font-sans">
        <AuthCheck /> {/* Include the AuthCheck component */}
        <NavBar />
        {children}
      </body>
    </html>
  );
}
