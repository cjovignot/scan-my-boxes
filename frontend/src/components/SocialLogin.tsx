// frontend/components/SocialLogin.tsx
import { useEffect } from "react";
import GoogleOneTap from "google-one-tap";

type SocialLoginProps = {
  onLogin: (data: { provider: string; token: string; profile?: any }) => void;
};

export const SocialLogin = ({ onLogin }: SocialLoginProps) => {
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    // Initialisation Google One Tap
    const googleOneTap = new GoogleOneTap({
      client_id: googleClientId,
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: (response: any) => {
        // Envoi du token Google au backend
        onLogin({ provider: "google", token: response.credential });
      },
    });

    googleOneTap.show();

    // Cleanup à la désactivation du composant
    return () => googleOneTap.hide();
  }, [onLogin]);

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => alert("Google One Tap se déclenche automatiquement !")}
        className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded hover:bg-blue-400"
      >
        Continuer avec Google
      </button>
    </div>
  );
};