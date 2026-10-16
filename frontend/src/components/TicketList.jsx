import { useState } from "react";
import { STATUT_LABELS } from "../constants";

function formaterDate(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function TicketList({ tickets, onClose }) {
  const [confirmId, setConfirmId] = useState(null);
  const [enCoursId, setEnCoursId] = useState(null);

  async function confirmer(id) {
    setEnCoursId(id);
    await onClose(id);
    setEnCoursId(null);
    setConfirmId(null);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Titre</th>
          <th>Statut</th>
          <th>Date de création</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => {
          const fermable = t.statut === "OUVERT" || t.statut === "EN_COURS";
          return (
            <tr key={t.id}>
              <td>{t.titre}</td>
              <td>
                <span className={`badge ${t.statut}`}>
                  {STATUT_LABELS[t.statut] ?? t.statut}
                </span>
              </td>
              <td>{formaterDate(t.dateCreation)}</td>
              <td>
                {!fermable && "—"}
                {fermable && confirmId !== t.id && (
                  <button onClick={() => setConfirmId(t.id)}>Fermer</button>
                )}
                {fermable && confirmId === t.id && (
                  <span className="confirmation">
                    Fermer ce ticket ?{" "}
                    <button
                      onClick={() => confirmer(t.id)}
                      disabled={enCoursId === t.id}
                    >
                      {enCoursId === t.id ? "…" : "Oui"}
                    </button>{" "}
                    <button
                      className="secondaire"
                      onClick={() => setConfirmId(null)}
                      disabled={enCoursId === t.id}
                    >
                      Non
                    </button>
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
