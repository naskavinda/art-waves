import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar/Navbar";

export const PageLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
