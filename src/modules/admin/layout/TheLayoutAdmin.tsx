import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import { useSelector } from "react-redux";
import { IRootState } from "../../../lib/store";
import { DEFINE_ROUTERS_ADMIN } from "../../../constants/routers-mapper";

export default function TheLayoutAdmin() {
  const user = useSelector((state: IRootState) => state.user);

  const admin = user.role === "ADMIN";

  if (!admin) {
    return (
      <div
        className="flex flex-col justify-center items-center h-100 w-100 mt-5 text-red-500"
        style={{ fontSize: "2rem", fontWeight: "bold" }}
      >
        Unauthorized
        <Navigate to={DEFINE_ROUTERS_ADMIN.loginAdmin} replace />
      </div>
    );
  }

  return (
    <div
      className="flex flex-row"
      style={{
        overflowY: "hidden",
        height: "100vh",
      }}
    >
      <Sidebar />
      <div
        className="py-4 px-5 h-full w-full"
        style={{ overflowY: "auto" }}
      >
        <Outlet />
      </div>
    </div>
  );
}
