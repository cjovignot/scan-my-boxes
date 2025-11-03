import { useApi } from "../hooks/useApi";
import PageWrapper from "../components/PageWrapper";

const Home = () => {
  const { data, loading, error } = useApi<{ message: string }>("/api/example");

  return (
    <>
      <PageWrapper>
        <h1>Vite + React + API</h1>

        <div className="card">
          {loading && <p>⏳ Chargement des données...</p>}
          {error && <p style={{ color: "red" }}>❌ {error}</p>}
          {data && (
            <>
              <p>🛰️ Réponse de l’API :</p>
              <code>{data.message}</code>
            </>
          )}
        </div>

        <p className="read-the-docs">Click on the logos to learn more</p>
      </PageWrapper>
    </>
  );
};

export default Home;
