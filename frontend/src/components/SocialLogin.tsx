import { useEffect } from "react";

type SocialLoginProps = {
  onLogin: (data: { token: string }) => void;
};

export const SocialLogin = ({ onLogin }: SocialLoginProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_URL = import.meta.env.VITE_API_URL;

    if (isStandalone) {
      console.log("PWA détectée : utilisation du flux Google Redirect");
      window.location.href = `${API_URL}/api/auth/google-redirect`;
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
    });

    // ✅ bouton Google plus stylé
    // @ts-ignore
    window.google?.accounts.id.renderButton(
      document.getElementById("googleSignIn")!,
      {
        theme: "filled_black", // ou "outline"
        size: "large", // small | medium | large
        shape: "pill", // ✅ coins arrondis
        logo_alignment: "left",
        width: 250, // largeur personnalisée
      }
    );
  }, [onLogin]);

  return (
    <div className="flex justify-center">
      {/* ✅ joli conteneur Tailwind autour du bouton */}
      <div
        id="googleSignIn"
        className="overflow-hidden transition-transform duration-200 rounded-full shadow-md hover:shadow-lg hover:scale-105"
      ></div>
    </div>
  );
};
