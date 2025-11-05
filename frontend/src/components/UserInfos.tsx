import { useApi } from "../hooks/useApi";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
}

const UserInfos = () => {
  const { data, loading, error } = useApi<User[]>("/api/user");

  return (
    <div className="w-full max-w-md p-6 bg-gray-900 border border-gray-800 shadow-lg rounded-2xl">
      <h2 className="mb-4 text-lg font-semibold text-yellow-400">
        👥 Liste des utilisateurs
      </h2>

      {loading && <p className="text-center text-gray-400">⏳ Chargement...</p>}
      {error && <p className="text-center text-red-400">❌ {error}</p>}

      {data && data.length === 0 && (
        <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>
      )}

      {data && data.length > 0 && (
        <ul className="divide-y divide-gray-800">
          {data.map((user) => (
            <li key={user._id} className="py-3">
              <p className="font-medium text-yellow-400">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              {user.createdAt && (
                <p className="mt-1 text-xs text-gray-500">
                  Créé le {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserInfos;
