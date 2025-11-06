// frontend/components/SocialLogin.tsx
import { useEffect } from "react";
import GoogleOneTap from "google-one-tap";
import AppleLogin from "react-apple-login";

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

  // --- APPLE LOGIN ---
  const handleAppleSuccess = (response: any) => {
    onLogin({
      provider: "apple",
      token: response.authorization.code,
      profile: response.user,
    });
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Apple Sign In */}
      <AppleLogin
        clientId={import.meta.env.VITE_APPLE_CLIENT_ID}
        redirectURI={import.meta.env.VITE_APPLE_REDIRECT_URI}
        responseType="code"
        responseMode="query"
        usePopup={true}
        designProp={{
          height: 40,
          width: 250,
          color: "black",
          border: false,
          type: "sign-in",
        }}
        onSuccess={handleAppleSuccess}
        onFailure={(err) => console.error("Apple login error:", err)}
      />
    </div>
  );
};