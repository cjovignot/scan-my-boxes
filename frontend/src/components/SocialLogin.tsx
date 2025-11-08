import { useEffect } from "react";

type SocialLoginProps = {
  onLogin: (data: { token: string }) => void;
};

export const SocialLogin = ({ onLogin }: SocialLoginProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleCredentialResponse = (response: any) => {
      if (response?.credential) {
        onLogin({ token: response.credential });
      }
    };

    // ✅ Initialisation sans auto-prompt
    // @ts-ignore
    window.google?.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      // ✅ Empêche le lancement automatique sur PWA
      disable_auto_prompt: true,
    });

    // ✅ bouton Google stylé et manuel
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
  }, [onLogin]);

  return (
    <div className="flex justify-center">
      <div
        id="googleSignIn"
        className="overflow-hidden transition-transform duration-200 rounded-full shadow-md hover:shadow-lg hover:scale-105"
      ></div>
    </div>
  );
};