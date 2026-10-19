import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import TicketsPage from "./components/TicketsPage";
import CreateTicketPage from "./components/CreateTicketPage";

export default function App() {
  const [toast, setToast] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  function notifier(texte) {
    setToast({ id: Date.now(), texte });
  }

  function onTicketCree() {
    notifier("Ticket créé. Le tableau a été mis à jour.");
    setReloadKey((k) => k + 1);
  }

  return (
    <div className="app">
      <header className="entete">
        <div className="conteneur">
          <h1>Suivi des tickets</h1>
          <p>Créez une demande, suivez son statut, fermez-la une fois traitée.</p>
        </div>
      </header>

      <main className="conteneur page-courante espace-travail">
        <CreateTicketPage onTicketCree={onTicketCree} />
        <TicketsPage notifier={notifier} reloadKey={reloadKey} />
      </main>

      <Footer />

      {toast && (
        <div key={toast.id} className="toast" role="status">
          {toast.texte}
        </div>
      )}
    </div>
  );
}
