import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useApiMutation } from "../hooks/useApiMutation";

type EditUserModalProps = {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

// ✅ Simple toast temporaire
const Toast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed px-4 py-2 text-white bg-gray-800 rounded shadow-lg bottom-4 right-4">
      {message}
    </div>
  );
};

export const EditUserModal = ({
  userId,
  isOpen,
  onClose,
  onSuccess,
}: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // ✅ ajout du champ rôle
  });
  const [toast, setToast] = useState<string | null>(null);

  // ✅ Charger automatiquement l’utilisateur via useApi
  const { data: user } = useApi<{
    _id: string;
    name: string;
    email: string;
    role: string;
  }>(`/api/user/${userId}`, { skip: !userId }); // ✅ utilisation directe de skip

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role || "user",
      });
    }
  }, [user]);

  // ✅ Mutation mise à jour avec useApiMutation
  const { mutate, loading, error } = useApiMutation<
    { message: string },
    Partial<typeof formData>
  >(`/api/user/${userId}`, "PATCH", {
    onSuccess: (data) => {
      setToast(data.message || "Utilisateur mis à jour !");
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Erreur lors de la mise à jour";
      setToast(msg);
    },
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return setToast("ID utilisateur manquant");

    try {
      await mutate(formData); // ✅ appel du hook mutation
    } catch {
      /* l'erreur est déjà gérée via onError */
    }
  };

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="fixed inset-0 flex items-center justify-center z-999 bg-black/60">
        <div className="w-full max-w-md p-6 text-white shadow-lg bg-gray-950 rounded-xl">
          <h2 className="mb-4 text-lg font-semibold text-yellow-400">
            Modifier l’utilisateur
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Nom</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">
                Nouveau mot de passe (optionnel)
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              />
            </div>

            {/* ✅ Sélecteur de rôle */}
            <div>
              <label className="block mb-1 text-sm">Rôle</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-gray-700 rounded hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-black bg-yellow-500 rounded hover:bg-yellow-400"
              >
                {loading ? "Sauvegarde..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
