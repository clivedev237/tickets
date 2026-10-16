import { useEffect, useRef, useState } from "react";
import { STATUT_LABELS } from "../constants";

function formaterDate(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TicketList({ tickets, onFermer }) {
  const [aFermer, setAFermer] = useState(null);
  const [enCours, setEnCours] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (aFermer && !dialog.open) dialog.showModal();
    if (!aFermer && dialog.open) dialog.close();
  }, [aFermer]);

  async function confirmer() {
    setEnCours(true);
    await onFermer(aFermer.id);
    setEnCours(false);
    setAFermer(null);
  }

  return (
    <>
      <div className="tableau-conteneur">
        <table>
          <thead>
            <tr>
              <th scope="col">Titre</th>
              <th scope="col">Statut</th>
              <th scope="col">Date de création</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => {
              const fermable = t.statut === "OUVERT" || t.statut === "EN_COURS";
              return (
                <tr key={t.id} className={`ligne ligne--${t.statut}`}>
                  <td>
                    <span className="ligne-titre">{t.titre}</span>
                    {t.description && (
                      <span className="ligne-description">{t.description}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge--${t.statut}`}>
                      {STATUT_LABELS[t.statut] ?? t.statut}
                    </span>
                  </td>
                  <td className="cellule-date">{formaterDate(t.dateCreation)}</td>
                  <td>
                    {fermable ? (
                      <button
                        className="bouton bouton--contour bouton--petit"
                        onClick={() => setAFermer(t)}
                      >
                        Fermer
                      </button>
                    ) : (
                      <span className="tiret" aria-label="Aucune action disponible">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <dialog
        ref={dialogRef}
        className="dialogue"
        onClose={() => setAFermer(null)}
        onCancel={(e) => enCours && e.preventDefault()}
      >
        {aFermer && (
          <>
            <h3>Fermer ce ticket ?</h3>
            <p>
              <strong>{aFermer.titre}</strong>
            </p>
            <p className="aide">Un ticket fermé ne peut plus changer d'état.</p>
            <div className="dialogue-actions">
              <button
                className="bouton bouton--secondaire"
                onClick={() => setAFermer(null)}
                disabled={enCours}
              >
                Annuler
              </button>
              <button
                className="bouton bouton--plein"
                onClick={confirmer}
                disabled={enCours}
              >
                {enCours ? "Fermeture…" : "Fermer le ticket"}
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
