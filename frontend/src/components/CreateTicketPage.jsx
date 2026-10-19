import { ticketService } from "../services/ticketService";
import TicketForm from "./TicketForm";

export default function CreateTicketPage({ onTicketCree }) {
  async function creer(titre, description) {
    await ticketService.creer(titre, description); // l'erreur remonte au formulaire
    onTicketCree();
  }

  return (
    <div className="colonne-creation">
      <TicketForm onCreate={creer} />
    </div>
  );
}
