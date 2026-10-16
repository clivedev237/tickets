import { useState } from "react";

export default function TicketForm({ onCreate }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      await onCreate(titre.trim(), description.trim() || null);
      setTitre("");
      setDescription("");
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form className="panneau formulaire" onSubmit={handleSubmit} noValidate>
      <h2>Nouveau ticket</h2>
      <p className="aide">Décrivez la demande en une phrase, puis ajoutez des détails si besoin.</p>

      <div className="champ">
        <label htmlFor="titre">Titre</label>
        <input
          id="titre"
          type="text"
          value={titre}
          onChange={(e) => {
            setTitre(e.target.value);
            setErreur(null);
          }}
          placeholder="Ex. : Imprimante en panne au 2e étage"
          aria-invalid={erreur ? "true" : "false"}
          aria-describedby={erreur ? "erreur-formulaire" : undefined}
          autoComplete="off"
        />
      </div>

      <div className="champ">
        <label htmlFor="description">
          Description <span className="facultatif">(facultative)</span>
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Contexte, étapes pour reproduire, personnes concernées…"
        />
      </div>

      {erreur && (
        <p id="erreur-formulaire" className="alerte alerte--erreur" role="alert">
          {erreur}
        </p>
      )}

      <button
        type="submit"
        className="bouton bouton--plein"
        disabled={titre.trim() === "" || envoi}
      >
        {envoi ? "Création en cours…" : "Créer le ticket"}
      </button>
    </form>
  );
}
