import { useEffect, useState } from "react";

type SocialLoginProps = {
  onLogin: (data: { token: string }) => void;
};

export const SocialLogin = ({ onLogin }: SocialLoginProps) => {
  const [isPWA, setIsPWA] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone; // pour iOS

    setIsPWA(isStandalone);

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_URL = import.meta.env.VITE_API_URL;

    const redirectUrl = `${API_URL}/api/auth/google-redirect?source=pwa`;

    log(`🔹 GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}`);
    log(`🔹 API_URL: ${API_URL}`);
    log(`🔹 Mode PWA: ${isStandalone}`);
    log(`🔹 URL de redirection: ${redirectUrl}`);

    if (isStandalone) {
      log("🟡 PWA détectée → bouton personnalisé affiché");
      return;
    }

    const handleCredentialResponse = (response: any) => {
      if (response?.credential) {
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

    log("🟢 Bouton Google rendu.");
  }, [onLogin]);

  // 🧱 Bouton custom pour PWA
  const handlePwaLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const redirectUrl = `${API_URL}/api/auth/google-redirect?source=pwa`;
    window.location.href = redirectUrl;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!isPWA ? (
        <div
          id="googleSignIn"
          className="overflow-hidden transition-transform duration-200 rounded-full shadow-md hover:shadow-lg hover:scale-105"
        ></div>
      ) : (
        <button
          onClick={handlePwaLogin}
          className="flex items-center justify-center px-6 py-3 text-black transition-transform bg-white rounded-full shadow hover:scale-105"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Connexion Google (PWA)
        </button>
      )}

      {/* 🔍 Affiche les logs directement dans le composant */}
      <div className="w-full max-w-sm p-2 mt-4 text-xs text-gray-400 bg-gray-900 rounded-lg">
        {logs.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
};
