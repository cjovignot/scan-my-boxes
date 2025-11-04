import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, User, ScanQrCode } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/", icon: <Home size={22} strokeWidth={0.75} />, label: "Accueil" },
    { to: "/profile", icon: <User size={22} strokeWidth={0.75} />, label: "Profil" },
  ];

  const handleFabClick = () => {
    alert("🚀 Action rapide !");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-auto py-4 bg-gray-800 shadow-md md:hidden">

      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to}>
          {({ isActive }) => (
            <motion.div
              layout
              className={`flex items-center px-3 py-2 transition-colors ${
                isActive ? "!bg-gray-400 rounded-full text-gray-900" : "!text-gray-300"
              }`}
              animate={{ width: isActive ? "auto" : "44px" }}  // 👈 largeur dynamique
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              {/* Icône */}
              <motion.div
                layout
                animate={{ x: isActive ? 0 : 0, scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {item.icon}
              </motion.div>

              {/* Label glissé depuis la droite */}
              <motion.span
                layout
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  x: isActive ? 6 : 12,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="text-[11px] font-light whitespace-nowrap ml-1"
              >
                {item.label}
              </motion.span>
            </motion.div>
          )}
        </NavLink>
      ))}

      {/* FAB CENTRALE */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={handleFabClick}
        className="fixed !p-3 h-auto w-auto text-white bottom-7 !bg-gray-900 !rounded-full"
      >
        <ScanQrCode size={32} />
      </motion.button>
    </nav>
  );
};

export default BottomNav;