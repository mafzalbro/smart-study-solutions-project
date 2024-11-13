import { AdminAuthProvider } from "@/app/(admin)/customHooks/AdminAuthProvider";
import NavBarAdmin from "../components/navbar/NavBarAdmin";
import Sidebar from "../components/sidebar/Sidebar";
import AdminWrapper from "../components/admin/AdminWrapper";

export const metadata = {
  title: "Admin Dashboard",
  description: "CMS to Handle all control of site!",
};
const AdminRootLayout = async ({ children }) => {
  return (
    <AdminAuthProvider>
      <NavBarAdmin />
      {/* <h2 className="text-4xl text-center my-10">Admin Dashboard</h2> */}
      <div className="flex flex-col md:flex-row p-2">
        <Sidebar />
        <AdminWrapper>{children}</AdminWrapper>
      </div>
    </AdminAuthProvider>
  );
};

export default AdminRootLayout;
