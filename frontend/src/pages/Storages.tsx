import PageWrapper from "../components/PageWrapper";
import { Pencil, Trash } from "lucide-react";

type Storage = {
  id: string;
  name: string;
  address: string;
  boxes: { id: string; label: string }[];
  ownerId: string;
};

const Storages = () => {
  // ✅ Simulation de données (en attendant la connexion au backend)
  const storageData: Storage[] = [
    {
      id: "1",
      name: "Garage Maison",
      address: "12 Rue des Peupliers, Rennes",
      boxes: [{ id: "A1", label: "Vêtements" }, { id: "A2", label: "Livres" }],
      ownerId: "user123",
    },
    {
      id: "2",
      name: "Cave Immeuble",
      address: "8 Avenue du Général, Nantes",
      boxes: [{ id: "B1", label: "Décos Noël" }],
      ownerId: "user123",
    },
    {
      id: "3",
      name: "Box de stockage",
      address: "Parc Logistique, Saint-Malo",
      boxes: [],
      ownerId: "user123",
    },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col px-6 py-10 text-white">

        <h1 className="mb-6 text-4xl font-bold text-center text-yellow-400">
          Entrepôts
        </h1>

        {/* List */}
        <div className="flex flex-col w-full gap-4">
          {storageData.map((storage) => (
            <div
              key={storage.id}
              className="flex flex-col p-4 bg-gray-800 rounded-xl border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-yellow-300">
                  {storage.name}
                </h2>

                <div className="flex items-center gap-3">
                  <button className="p-2 transition-colors rounded hover:bg-gray-700">
                    <Pencil size={18} />
                  </button>
                  <button className="p-2 transition-colors rounded hover:bg-red-700">
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-400">{storage.address}</p>

              <div className="mt-3 text-sm text-gray-300">
                <span className="font-medium text-yellow-400">
                  {storage.boxes.length}
                </span>{" "}
                boîte(s) stockée(s)
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-center text-gray-500">
          Liste de vos entrepôts.
        </p>
      </div>
    </PageWrapper>
  );
};

export default Storages;