import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const MobileLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Contenu scrollable */}
      <div className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </div>

      {/* Barre de navigation fixe */}
      <BottomNav />
    </div>
  );
};

export default MobileLayout;
