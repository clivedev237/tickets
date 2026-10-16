import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import { STATUT_LABELS } from "../constants";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";

export default function TicketsPage() {
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
    setLoading(true);
    setCloseError(null);
    setFiltre(valeur);
  }

  async function creer(titre, description) {
    await ticketService.creer(titre, description); // l'erreur remonte au formulaire
    setFiltre("");
    recharger();
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
    } catch (err) {
      setCloseError(err.message);
      if (err.status === 409 || err.status === 404) recharger();
    }
  }

  return (
    <main className="page">
      <h1>Suivi des tickets de support</h1>

      <TicketForm onCreate={creer} />

      <section className="carte">
        <div className="barre">
          <h2>Tickets</h2>
          <label>
            Filtrer par statut{" "}
            <select value={filtre} onChange={(e) => changerFiltre(e.target.value)}>
              <option value="">Tous</option>
              {Object.entries(STATUT_LABELS).map(([valeur, label]) => (
                <option key={valeur} value={valeur}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {closeError && (
          <p className="message erreur" role="alert">
            {closeError}
          </p>
        )}

        {loading && (
          <p className="message" role="status">
            Chargement des tickets…
          </p>
        )}

        {!loading && error && (
          <div className="message erreur" role="alert">
            <p>{error}</p>
            <button onClick={recharger}>Réessayer</button>
          </div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <p className="message">Aucun ticket</p>
        )}

        {!loading && !error && tickets.length > 0 && (
          <TicketList tickets={tickets} onClose={fermer} />
        )}
      </section>
    </main>
  );
}
