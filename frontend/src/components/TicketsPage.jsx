import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import { FILTRES } from "../constants";
import TicketList from "./TicketList";

export default function TicketsPage({ notifier }) {
  const [tickets, setTickets] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [closeError, setCloseError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let annule = false;
    ticketService
      .lister(filtre)
      .then((data) => {
        if (!annule) {
          setTickets(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!annule) setError(err.message);
      })
      .finally(() => {
        if (!annule) setLoading(false);
      });
    return () => {
      annule = true;
    };
  }, [filtre, reloadKey]);

  function recharger() {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }

  function changerFiltre(valeur) {
    if (valeur === filtre) return;
    setLoading(true);
    setCloseError(null);
    setFiltre(valeur);
  }

  async function fermer(id) {
    setCloseError(null);
    try {
      const maj = await ticketService.fermer(id);
      setTickets((prev) =>
        filtre && maj.statut !== filtre
          ? prev.filter((t) => t.id !== id)
          : prev.map((t) => (t.id === id ? maj : t))
      );
      notifier("Ticket fermé.");
    } catch (err) {
      setCloseError(err.message);
      if (err.status === 409 || err.status === 404) recharger();
    }
  }

  const aucunTicket = !loading && !error && tickets.length === 0;

  return (
    <section className="panneau liste" aria-labelledby="titre-liste">
      <div className="barre">
        <div>
          <h2 id="titre-liste">Tickets</h2>
          {!loading && !error && (
            <p className="compteur">
              {tickets.length} {tickets.length > 1 ? "tickets" : "ticket"}
            </p>
          )}
        </div>
        <div className="segments" role="group" aria-label="Filtrer par statut">
          {FILTRES.map((f) => (
            <button
              key={f.valeur || "tous"}
              type="button"
              aria-pressed={filtre === f.valeur}
              onClick={() => changerFiltre(f.valeur)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {closeError && (
        <p className="alerte alerte--erreur" role="alert">
          {closeError}
        </p>
      )}

      {loading && (
        <div role="status" aria-live="polite">
          <p className="chargement">
            <span className="spinner" aria-hidden="true" />
            Chargement des tickets…
          </p>
          <div className="squelette" aria-hidden="true">
            <div /><div /><div /><div />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="etat etat--erreur" role="alert">
          <p className="etat-titre">Impossible de charger les tickets</p>
          <p>{error}</p>
          <button className="bouton bouton--plein" onClick={recharger}>
            Réessayer
          </button>
        </div>
      )}

      {aucunTicket && (
        <div className="etat">
          <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden="true">
            <path
              d="M6 8h60v14a6 6 0 0 0 0 12v14H6V34a6 6 0 0 0 0-12V8Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M46 8v40" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 5" />
            <path d="M16 22h20M16 32h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <p className="etat-titre">Aucun ticket</p>
          <p>
            {filtre
              ? "Aucun ticket ne correspond à ce statut pour le moment."
              : "Créez le premier depuis la page « Nouveau ticket »."}
          </p>
        </div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <TicketList tickets={tickets} onFermer={fermer} />
      )}
    </section>
  );
}
