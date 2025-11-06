// frontend/components/SocialLogin.tsx
import { useEffect } from "react";
import jwtDecode from "jwt-decode";

declare global {
  interface Window {
    google?: any;
    AppleID?: any;
  }
}

type Props = {
  onLogin: (data: { provider: "google" | "apple"; token: string; profile?: any }) => void;
};

export const SocialLogin = ({ onLogin }: Props) => {
  // GOOGLE
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        const token = response.credential;
        const profile = jwtDecode(token);
        onLogin({ provider: "google", token, profile });
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      {
        theme: "filled_black",
        size: "large",
        shape: "pill",
      }
    );
  }, []);

  // APPLE / iCloud
  const loginWithApple = async () => {
    try {
      const res = await window.AppleID.auth.signIn();
      const token = res.authorization.id_token;
      onLogin({ provider: "apple", token });
    } catch (err) {
      console.error("Erreur Apple Sign-In:", err);
    }
  };

  return (
    <div className="space-y-3 flex flex-col items-center">
      {/* BOUTON GOOGLE */}
      <div id="google-btn" />

      {/* BOUTON APPLE */}
      <button
        onClick={loginWithApple}
        className="px-4 py-2 rounded bg-white text-black font-semibold shadow-md hover:bg-gray-200 transition"
      >
        Continuer avec Apple
      </button>
    </div>
  );
};