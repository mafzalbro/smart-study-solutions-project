import { AdminAuthProvider } from "@/app/(admin)/customHooks/AdminAuthProvider";
import NavBarAdmin from "../components/navbar/NavBarAdmin";
import Sidebar from "../components/sidebar/Sidebar";

export const metadata = {
    title: "Admin Dashboard",
    description: "CMS to Handle all control of site!",
  };
const AdminRootLayout = ({ children }) => {
  return (
            <AdminAuthProvider>
                <NavBarAdmin/>
                {/* <h2 className="text-4xl text-center my-10">Admin Dashboard</h2> */}
                <div className="flex flex-col md:flex-row">
                <Sidebar />
                <div className="md:w-3/4">
                {children}
                </div>
                </div>
            </AdminAuthProvider>
    );
};

export default AdminRootLayout;
