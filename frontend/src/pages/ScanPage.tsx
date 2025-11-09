import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ScanPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleResult = (result: string) => {
    if (result) {
      alert(`✅ QR Code détecté : ${result}`);
      // 👉 Exemple : redirection vers une boîte
      // navigate(`/boxes/${result}`);
      navigate(-1); // Retour à la page précédente
    }
  };

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
        <div className="w-8" /> {/* pour équilibrer la barre */}
      </div>

      {/* Scanner */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-md overflow-hidden border border-gray-700 aspect-square rounded-2xl">
          <Scanner
            onScan={(res) => {
              if (res?.[0]?.rawValue) handleResult(res[0].rawValue);
            }}
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
        <p className="mt-4 text-sm text-gray-400">
          Oriente ton appareil vers un QR code.
        </p>
      </div>
    </div>
  );
};

export default ScanPage;
