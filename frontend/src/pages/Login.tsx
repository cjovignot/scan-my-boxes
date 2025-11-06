// pages/login.tsx
import PageWrapper from "../components/PageWrapper";
import { SocialLogin } from "../components/SocialLogin";
import axios from "../api/axiosClient";

const LoginPage = () => {
  const handleSocialLogin = async ({ provider, token, profile }: any) => {
    try {
      const res = await axios.post("/api/auth/social-login", {
        provider,
        token,
        profile,
      });

      console.log("✅ connecté:", res.data.user);

      // Si tu veux rediriger après connexion :
      // window.location.href = "/";
    } catch (err) {
      console.error("❌ Erreur lors de la connexion :", err);
    }
  };

  return (
    <PageWrapper>
      <div className="flex justify-center items-center min-h-screen px-6 py-10 bg-gray-950 text-white">
        <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 shadow-lg rounded-2xl space-y-6 text-center">
          <h1 className="text-3xl font-bold text-yellow-400">
            🔐 Connexion
          </h1>

          <p className="text-gray-400 text-sm">
            Choisissez une méthode d’identification :
          </p>

          <SocialLogin onLogin={handleSocialLogin} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default LoginPage;