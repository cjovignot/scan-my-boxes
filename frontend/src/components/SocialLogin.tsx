// frontend/components/SocialLogin.tsx
import { useEffect } from "react";
import GoogleOneTap from "google-one-tap";

type SocialLoginProps = {
  onLogin: (data: { provider: string; token: string; profile?: any }) => void;
};

export const SocialLogin = ({ onLogin }: SocialLoginProps) => {
  // --- GOOGLE ONE TAP ---
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const googleOneTap = new GoogleOneTap({
      client_id: googleClientId,
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: (response: any) => {
        onLogin({ provider: "google", token: response.credential });
      },
    });

    googleOneTap.show();

    return () => googleOneTap.hide();
  }, [onLogin]);