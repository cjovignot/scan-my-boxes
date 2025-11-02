import { useState } from "react";
import axios, { AxiosError } from "axios";
import axiosClient from "../api/axiosClient";

// 🧩 Importation des types partagés
import { Example, CreateExampleResponse } from "../types";

export default function AddExample() {
  const [formData, setFormData] = useState<Example>({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CreateExampleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axiosClient.post<CreateExampleResponse>(
        "/api/example",
        formData
      );
      setResponse(res.data);
      setFormData({ name: "", description: "" }); // reset form
    } catch (err: unknown) {
      console.error("❌ API error:", err);

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error?: string }>;
        setError(axiosError.response?.data?.error || "Erreur API inconnue");
      } else {
        setError("Erreur inattendue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-4 mx-auto bg-white border rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">🧾 Ajouter un document</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nom"
          className="p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optionnelle)"
          className="p-2 border rounded"
          rows={3}
        />
        <button
          type="submit"
          disabled={loading}
          className="py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          {loading ? "⏳ Envoi..." : "Créer le document"}
        </button>
      </form>

      {error && <p className="mt-3 text-red-500">❌ {error}</p>}

      {response?.document && (
        <div className="p-2 mt-3 bg-green-100 border border-green-300 rounded">
          ✅ Document créé : <strong>{response.document.name}</strong>
        </div>
      )}
    </div>
  );
}
