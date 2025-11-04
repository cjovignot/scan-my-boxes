import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, User, ScanQrCode } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navItems = [
    { to: "/", icon: <Home size={22} strokeWidth={0.75} />, label: "Accueil" },
    { to: "/profile", icon: <User size={22} strokeWidth={0.75} />, label: "Profil" },
  ];

  const handleFabClick = () => {
    alert("🚀 Action rapide !");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-auto py-4 bg-gray-800 shadow-md md:hidden">
      
      {/* Icônes de gauche */}
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors !font-thin ${
              isActive ? "!text-yellow-400" : "!text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex items-center"
            >
              {/* Icône */}
              <motion.div
                animate={{ x: isActive ? -4 : 0, scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
              >
                {item.icon}
              </motion.div>

              {/* Label animé */}
              <motion.span
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  x: isActive ? 0 : 10, // glisse de droite → gauche
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="text-[10px] ml-2 whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </motion.div>
          )}
        </NavLink>
      ))}

      {/* BOUTON CENTRAL (FAB) */}
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