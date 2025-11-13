import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useApi } from "../hooks/useApi";
import { useApiMutation } from "../hooks/useApiMutation";

const Settings = () => {
  const { user } = useAuth()!;
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailUpdates: false,
  });

  // 🔹 Redirection si pas connecté
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // 🔹 Récupération des paramètres
  const { data: fetchedSettings } = useApi<{
    darkMode: boolean;
    notifications: boolean;
    emailUpdates: boolean;
  }>(user?._id ? `/api/user/${user._id}/settings` : undefined);

  useEffect(() => {
    if (fetchedSettings)
      setSettings((prev) => ({ ...prev, ...fetchedSettings }));
  }, [fetchedSettings]);

  const handleChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Mutation pour sauvegarder les paramètres
  const { mutate: saveSettings, loading } = useApiMutation(
    user?._id ? `/api/user/${user._id}/settings` : "",
    "PUT",
    {
      onSuccess: () => {
        alert("✅ Paramètres mis à jour avec succès !");
      },
      onError: (err) => {
        console.error("Erreur lors de la sauvegarde :", err);
        alert("❌ Erreur lors de la mise à jour des paramètres.");
      },
    }
  );

  const handleSave = () => {
    if (!user?._id) return;
    saveSettings(settings);
  };

  if (!user) return null;

  return (
    <PageWrapper>
      <div className="flex flex-col items-center px-6 py-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
          <h1 className="mt-4 text-3xl font-semibold text-yellow-400">
            Paramètres
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gère tes préférences et ton expérience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-full max-w-md p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-2xl"
        >
          {/* Préférences */}
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span>Mode sombre</span>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleChange("darkMode", e.target.checked)}
              className="w-5 h-5 accent-yellow-400"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span>Notifications activées</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleChange("notifications", e.target.checked)}
              className="w-5 h-5 accent-yellow-400"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <span>Recevoir les mises à jour par email</span>
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={(e) => handleChange("emailUpdates", e.target.checked)}
              className="w-5 h-5 accent-yellow-400"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 px-4 py-3 mt-6 font-medium text-black transition bg-yellow-400 rounded-full hover:bg-yellow-500 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Enregistrement..." : "Sauvegarder"}
          </motion.button>
        </motion.div>

        <p className="mt-10 text-sm text-center text-gray-500">
          Tes préférences sont enregistrées localement et sur ton compte.
        </p>
      </div>
    </PageWrapper>
  );
};

export default Settings;
