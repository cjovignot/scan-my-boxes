// frontend/src/components/UserInfos.tsx
import { useState, useMemo } from "react";
import { useApi } from "../hooks/useApi";
import { useApiMutation } from "../hooks/useApiMutation";
import { EditUserModal } from "./EditUserModal";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

const UserInfos = () => {
  const { data: users, loading, error, refetch } = useApi<User[]>("/api/user");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState(""); // 🔍 barre de recherche

  // ✅ Mutation pour la suppression d’un utilisateur
  const { mutate: deleteUser, loading: deleting } = useApiMutation<
    { message: string },
    undefined
  >("/api/user", "DELETE", {
    onSuccess: () => refetch(),
    onError: () => alert("❌ Erreur lors de la suppression."),
  });

  const handleEdit = (userId: string) => setSelectedUserId(userId);
  const closeModal = () => setSelectedUserId(null);

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Es-tu sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      await deleteUser(undefined, { url: `/api/user/${id}` });
    } catch (err) {
      console.error("Erreur suppression utilisateur :", err);
    }
  };

  // ✅ Filtrage performant avec useMemo
  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return (
      users?.filter(
        (u) =>
          u.email.toLowerCase().includes(term) ||
          u.name.toLowerCase().includes(term)
      ) ?? []
    );
  }, [users, search]);

  return (
    <div className="w-full max-w-md p-4 border border-gray-800 shadow-lg bg-gray-950 rounded-2xl">
      <h2 className="mb-4 text-lg font-semibold text-yellow-400">
        👥 Liste des utilisateurs
      </h2>

      {/* 🔍 Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par email ou nom..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 mb-4 text-sm text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400"
      />

      {loading && <p className="text-center text-gray-400">⏳ Chargement...</p>}
      {error && <p className="text-center text-red-400">❌ {error}</p>}

      {!loading && filteredUsers.length === 0 && (
        <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>
      )}

      {filteredUsers.length > 0 && (
        <ul className="divide-y divide-gray-800">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-yellow-400">{user.name}</p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
                {user.createdAt && (
                  <p className="mt-1 text-xs text-gray-500">
                    Créé le{" "}
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(user._id)}
                  className="px-3 py-1 text-sm text-black bg-yellow-500 rounded hover:bg-yellow-400"
                >
                  Modifier
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                  disabled={deleting}
                  className={`px-3 py-1 text-sm text-white rounded ${
                    deleting
                      ? "bg-red-800 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  {deleting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal d'édition */}
      <EditUserModal
        userId={selectedUserId}
        isOpen={!!selectedUserId}
        onClose={closeModal}
        onSuccess={refetch}
      />
    </div>
  );
};

export default UserInfos;
