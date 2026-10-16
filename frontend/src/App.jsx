import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import TicketsPage from "./components/TicketsPage";
import CreateTicketPage from "./components/CreateTicketPage";

const VUES = [
  { id: "creer", hash: "creer", label: "Nouveau ticket" },
  { id: "liste", hash: "liste", label: "Tableau des tickets" },
];

function vueDepuisHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  return VUES.some((v) => v.hash === h) ? h : null;
}

export default function App() {
  const [vue, setVue] = useState(() => vueDepuisHash() ?? "liste");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    function onHashChange() {
      const v = vueDepuisHash();
      if (v && v !== vue) setVue(v);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [vue]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  function naviguer(v) {
    window.location.hash = `/${v}`;
    setVue(v);
  }

  function notifier(texte) {
    setToast({ id: Date.now(), texte });
  }

  function allerAuTableau() {
    naviguer("liste");
  }

  return (
    <div className="app">
      <header className="entete">
        <div className="conteneur">
          <h1>Suivi des tickets</h1>
          <p>Créez une demande, suivez son statut, fermez-la une fois traitée.</p>
          <nav className="navigation" aria-label="Pages">
            {VUES.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={vue === v.id}
                onClick={() => naviguer(v.id)}
              >
                {v.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="conteneur page-courante">
        {vue === "creer" ? (
          <CreateTicketPage notifier={notifier} onTicketCree={allerAuTableau} />
        ) : (
          <TicketsPage notifier={notifier} />
        )}
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
