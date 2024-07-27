import Sidebar from "../components/dashboard/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div className="flex">
    <Sidebar/>
        {children}
    </div>
  );
}
