import { AdminAuthProvider } from "@/app/(admin)/customHooks/AdminAuthProvider";
import NavBarAdmin from "../components/navbar/NavBarAdmin";

const AdminRootLayout = ({ children }) => {
  return (
            <AdminAuthProvider>
                <NavBarAdmin/>
                {children}
            </AdminAuthProvider>
    );
};

export default AdminRootLayout;
