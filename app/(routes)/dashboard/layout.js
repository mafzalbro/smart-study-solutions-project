import Sidebar from "../../components/dashboard/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div className="flex md:gap-10 min-h-screen md:h-auto">
    <Sidebar />
        {children}
    </div>
  );
}
