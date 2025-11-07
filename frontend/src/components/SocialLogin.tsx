import { useEffect } from "react";

type SocialLoginProps = {
  onLogin: (data: { token: string }) => void;
};

export const SocialLogin = ({ onLogin }: SocialLoginProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone; // pour iOS

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const API_URL = import.meta.env.VITE_API_URL; // ton backend Vercel par ex.

    if (isStandalone) {
      // 🟡 Mode PWA → utiliser le flux redirect OAuth
      console.log("PWA détectée : utilisation du flux Google Redirect");
      window.location.href = `${API_URL}/api/auth/google-redirect`;
      return;
    }

    // 🟢 Mode navigateur classique → flux Google Identity (popup)
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

    // @ts-ignore
    window.google?.accounts.id.renderButton(
      document.getElementById("googleSignIn")!,
      { theme: "outline", size: "large" }
    );
  }, [onLogin]);

  return <div id="googleSignIn"></div>;
};
