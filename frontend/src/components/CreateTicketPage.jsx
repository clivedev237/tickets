import { useEffect, useState } from "react";
import { ticketService } from "../services/ticketService";
import TicketForm from "./TicketForm";

export default function CreateTicketPage({ notifier, onTicketCree }) {
  const [redirection, setRedirection] = useState(false);

  useEffect(() => {
    if (!redirection) return;
    const timer = setTimeout(onTicketCree, 1500);
    return () => clearTimeout(timer);
  }, [redirection, onTicketCree]);

  async function creer(titre, description) {
    await ticketService.creer(titre, description); // l'erreur remonte au formulaire
    notifier("Ticket créé. Redirection vers le tableau…");
    setRedirection(true);
  }

  return (
    <div className="page-creation">
      <TicketForm onCreate={creer} />
    </div>
  );
}
