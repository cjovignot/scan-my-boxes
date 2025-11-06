import { SocialLogin } from "../components/SocialLogin";
import axios from "../api/axiosClient";

const LoginPage = () => {
  const handleSocialLogin = async ({ provider, token, profile }: any) => {
    // Envoie le token au backend → création / login DB
    const res = await axios.post("/api/auth/social-login", {
      provider,
      token,
      profile,
    });

    console.log("✅ connecté:", res.data.user);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-xl shadow-lg space-y-4 w-80 text-center">
        <h1 className="text-xl font-semibold">Connexion</h1>
        <SocialLogin onLogin={handleSocialLogin} />
      </div>
    </div>
  );
};

export default LoginPage;