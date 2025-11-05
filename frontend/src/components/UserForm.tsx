import { useState } from "react";
import { useApiMutation } from "../hooks/useApiMutation";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ Hook pour créer un utilisateur
  const { mutate, loading, error, data } = useApiMutation<
    { message: string; user: { _id: string; name: string; email: string } },
    typeof formData
  >("/api/user", "POST", {
    onSuccess: () => {
      alert("✅ Utilisateur créé avec succès !");
      setFormData({ name: "", email: "", password: "" });
    },
    onError: (err) => {
      console.error("Erreur création utilisateur :", err);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutate(formData);
  };

  return (
    <div className="max-w-md p-6 mx-auto text-white bg-gray-900 shadow-lg rounded-2xl">
      <h2 className="mb-4 text-lg font-semibold text-yellow-400">
        Créer un utilisateur
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ nom */}
        <div>
          <label className="block mb-1 text-sm">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Champ email */}
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400"
          />
        </div>

        {/* Champ mot de passe */}
        <div>
          <label className="block mb-1 text-sm">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-yellow-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 font-semibold text-gray-900 transition bg-yellow-500 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer l'utilisateur"}
        </button>
      </form>

      {/* Messages */}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {data && <p className="mt-3 text-sm text-green-400">{data.message}</p>}
    </div>
  );
};

export default UserForm;
