import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";

const ScanPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ===============================
  // 🔹 États
  // ===============================
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"lecture" | "stockage">("lecture");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [scannedBoxes, setScannedBoxes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // ===============================
  // 🔹 Chargement des entrepôts
  // ===============================
  const {
    data: storages,
    loading: loadingStorages,
    error: storagesError,
  } = useApi<{ _id: string; name: string }[]>(
    user?._id ? `/api/storages?ownerId=${user._id}` : undefined
  );

  // ===============================
  // 🔹 Gestion du scan
  // ===============================
  const handleScan = (res: any) => {
    if (!res || res.length === 0) return;
    const qrValue = res[0].rawValue;

    if (mode === "lecture") {
      // 🔍 Extraction de l'ID de la boîte depuis l'URL
      const match = qrValue.match(/\/box\/([a-f0-9]{24})$/);
      const boxId = match ? match[1] : null;

      if (!boxId) {
        alert("❌ QR code invalide ou ID non détecté.");
        return;
      }

      // ✅ Redirection directe vers la page de détails
      navigate(`/box/boxdetails/${boxId}`);
    } else if (mode === "stockage") {
      setScannedBoxes((prev) =>
        prev.includes(qrValue) ? prev : [...prev, qrValue]
      );
    }
  };

  // ===============================
  // 🔹 Fin de saisie (stockage)
  // ===============================
  const handleSave = async () => {
    if (!selectedStorage) {
      alert("❌ Sélectionnez un entrepôt avant d’enregistrer.");
      return;
    }
    if (scannedBoxes.length === 0) {
      alert("❌ Aucune boîte scannée à enregistrer.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/storages/add-boxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storageId: selectedStorage,
          boxIds: scannedBoxes,
          userId: user._id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Boîtes enregistrées avec succès !");
        setScannedBoxes([]);
      } else {
        throw new Error(data.message || "Erreur d’enregistrement");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l’enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // 🔹 Rendu
  // ===============================
  return (
    <div className="fixed inset-0 z-50 flex flex-col text-white bg-black">
      {/* Barre du haut */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/60 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-yellow-400"
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <h1 className="text-lg font-semibold text-yellow-400">
          Scanner un code
        </h1>
        <div className="w-8" />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col items-center flex-1 px-4 py-6">
        {/* Scanner */}
        <div className="relative w-full max-w-md overflow-hidden border border-gray-700 aspect-square rounded-2xl">
          {/* Toggle superposé */}
          <div className="absolute z-20 flex items-center gap-2 px-2 py-1 -translate-x-1/2 border border-gray-600 rounded-full top-3 left-1/2 bg-black/60 backdrop-blur-sm w-fit">
            <span className="text-xs text-gray-300 whitespace-nowrap">
              Mode lecture
            </span>

            <label className="relative inline-flex items-center flex-shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={mode === "stockage"}
                onChange={(e) =>
                  setMode(e.target.checked ? "stockage" : "lecture")
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 transition-all duration-300 bg-gray-700 rounded-full peer peer-checked:bg-yellow-400"></div>
              <div className="absolute left-[2px] top-[2px] w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
            </label>

            <span className="text-xs text-gray-300 whitespace-nowrap">
              Mode stockage
            </span>
          </div>

          <Scanner
            onScan={handleScan}
            onError={(err) => setError(err.message)}
            styles={{
              container: { width: "100%", height: "100%" },
              video: { width: "100%", height: "100%", objectFit: "cover" },
            }}
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-center text-red-400">{error}</p>
        )}

        {/* Sélecteur d’entrepôt (mode stockage uniquement) */}
        {mode === "stockage" && (
          <div className="w-full max-w-md mt-4 mb-4">
            <div className="relative">
              <select
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="w-full px-3 py-2 pr-10 text-sm text-white transition-colors bg-gray-900 border border-gray-700 rounded-lg appearance-none focus:ring-1 focus:ring-yellow-400"
              >
                <option value="">Sélectionnez un entrepôt</option>
                {loadingStorages ? (
                  <option disabled>Chargement...</option>
                ) : storagesError ? (
                  <option disabled>Erreur de chargement</option>
                ) : (
                  storages?.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown
                size={16}
                className="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2"
              />
            </div>
          </div>
        )}

        {mode === "lecture" ? (
          <p className="mt-4 text-sm text-gray-400">
            Oriente ton appareil vers un QR code pour afficher la boîte.
          </p>
        ) : (
          <div className="w-full max-w-md mt-4">
            <h3 className="mb-2 text-yellow-400">
              Boîtes scannées ({scannedBoxes.length})
            </h3>
            {scannedBoxes.length === 0 ? (
              <p className="text-sm text-gray-400">
                Aucune boîte scannée pour l’instant.
              </p>
            ) : (
              <ul className="p-2 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg max-h-40">
                {scannedBoxes.map((b) => (
                  <li
                    key={b}
                    className="py-1 text-sm text-gray-300 border-b border-gray-700 last:border-none"
                  >
                    📦 {b}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-4 py-2 mt-4 text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-60"
            >
              {saving ? "Enregistrement..." : "✅ Fin de saisie"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
