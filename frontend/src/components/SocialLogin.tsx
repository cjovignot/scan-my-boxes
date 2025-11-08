import { useEffect, useState } from "react";

type SocialLoginProps = {
  onLogin: (data: { token: string }) => void;
};

export const SocialLogin = ({ onLogin }: SocialLoginProps) => {
  const [logs, setLogs] = useState<string[]>([]);

  // 🔧 Fonction utilitaire pour afficher les logs dans le composant
  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
    console.log(message); // aussi utile si on est sur desktop
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_URL = import.meta.env.VITE_API_URL;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    const redirectUrl = `${API_URL}/api/auth/google-redirect?source=pwa`;

    addLog(`🔹 GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}`);
    addLog(`🔹 API_URL: ${API_URL}`);
    addLog(`🔹 Mode PWA: ${isStandalone}`);
    addLog(`🔹 URL de redirection: ${redirectUrl}`);

    if (isStandalone) {
      addLog("🟡 PWA détectée → redirection vers Google OAuth...");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
      return;
    }

    const handleCredentialResponse = (response: any) => {
      if (response?.credential) {
        addLog("✅ Jeton Google reçu !");
        onLogin({ token: response.credential });
      }
    };

    // @ts-ignore
    window.google?.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      disable_auto_prompt: true,
    });

    // @ts-ignore
    window.google?.accounts.id.renderButton(
      document.getElementById("googleSignIn")!,
      {
        theme: "filled_black",
        size: "large",
        shape: "pill",
        logo_alignment: "left",
        width: 250,
      }
    );

    addLog("🟢 Bouton Google rendu.");
  }, [onLogin]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 🔹 Bouton Google */}
      <div
        id="googleSignIn"
        className="overflow-hidden transition-transform duration-200 rounded-full shadow-md hover:shadow-lg hover:scale-105"
      ></div>

      {/* 🔹 Zone de debug visible à l’écran */}
      {logs.length > 0 && (
        <div className="w-full max-w-sm p-3 mt-4 overflow-y-auto text-xs text-left text-green-300 bg-gray-900 border border-gray-700 rounded-lg max-h-48">
          <p className="mb-2 font-semibold text-yellow-400">🧩 Debug Log</p>
          {logs.map((log, i) => (
            <div key={i} className="py-1 border-t border-gray-700">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
