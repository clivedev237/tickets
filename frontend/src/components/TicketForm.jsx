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
    <form className="carte" onSubmit={handleSubmit}>
      <h2>Nouveau ticket</h2>

      <label>
        Titre
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex. : Imprimante en panne"
        />
      </label>

      <label>
        Description (facultative)
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      {erreur && (
        <p className="message erreur" role="alert">
          {erreur}
        </p>
      )}

      <button type="submit" disabled={titre.trim() === "" || envoi}>
        {envoi ? "Création…" : "Créer le ticket"}
      </button>
    </form>
  );
}
