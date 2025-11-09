import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QRScanner() {
  const [result, setResult] = useState("");

  return (
    <div className="p-4 text-white">
      <h2 className="mb-4 text-xl font-semibold">📷 Scanner un QR Code</h2>

      <Scanner
        onScan={(res) => {
          if (res && res.length > 0) {
            setResult(res[0].rawValue);
          }
        }}
        onError={(err) => console.error(err)}
        styles={{
          container: { width: "100%" },
          video: { borderRadius: "1rem" },
        }}
      />

      <p className="mt-4 text-yellow-400">
        Résultat : {result || "Aucun QR code détecté"}
      </p>
    </div>
  );
}
