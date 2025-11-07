import { useEffect } from "react";

type SocialLoginProps = {
  onLogin: (data: { token: string }) => void;
};

export const SocialLogin = ({ onLogin }: SocialLoginProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCredentialResponse = (response: any) => {
      if (response?.credential) {
        onLogin({ token: response.credential });
      }
    };

    // @ts-ignore
    window.google?.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    // @ts-ignore
    window.google?.accounts.id.renderButton(
      document.getElementById("googleSignIn")!,
      { theme: "outline", size: "large" }
    );

    // Optional : auto prompt
    // window.google?.accounts.id.prompt();
  }, []);

  return <div id="googleSignIn"></div>;
};