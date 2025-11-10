import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useApi } from "../../hooks/useApi";

interface ContentItem {
  _id: string;
  name: string;
  quantity?: number;
  picture?: string;
}

interface Box {
  _id: string;
  number: string; // remplacer "name"
  destination: string;
  storageId: string;
  content: ContentItem[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  qrcodeURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

const BoxDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: box,
    loading,
    error,
    refetch,
  } = useApi<Box>(id ? `/api/boxes/${id}` : undefined);

  useEffect(() => {
    if (id) refetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 bg-black">
        ⏳ Chargement des détails...
      </div>
    );
  }

  if (error || !box) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-gray-300 bg-black">
        <p className="mb-3 text-red-400">
          ❌ Impossible de charger les détails de la boîte.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm text-black bg-yellow-400 rounded-lg hover:bg-yellow-500"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Contenu principal */}
      <div className="flex flex-col flex-1 px-4 py-10">
        {/* 🧭 En-tête */}
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
            📦 {box.number}
          </h1>
        </motion.div>

        <div className="w-full p-4 mx-auto bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="mb-3 text-sm text-gray-300">
            Entrepôt :{" "}
            <span className="font-medium text-yellow-400">{box.storageId}</span>
          </p>

          <p className="mb-3 text-sm text-gray-300">
            Destination :{" "}
            <span className="font-medium text-yellow-400">
              {box.destination}
            </span>
          </p>

          <p className="mb-3 text-sm text-gray-300">
            Dimensions :{" "}
            <span className="font-medium text-yellow-400">
              {box.dimensions.width}×{box.dimensions.height}×
              {box.dimensions.depth} cm
            </span>
          </p>

          <div className="mt-6 mb-4 font-medium text-yellow-400">
            Contenu de la boîte
          </div>
          {/* Contenu de la boîte */}
          {box.content.length > 0 ? (
            <ul className="space-y-2">
              {box.content.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between px-3 py-2 text-sm text-gray-200 bg-gray-800 rounded-lg"
                >
                  <span>{item.name}</span>
                  {item.quantity && (
                    <span className="text-gray-400">x{item.quantity}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">
              Aucun élément dans cette boîte.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default BoxDetails;
