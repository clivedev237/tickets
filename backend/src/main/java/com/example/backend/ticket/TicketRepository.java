package com.example.backend.ticket;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    boolean existsByTitre(String titre);
    List<Ticket> findByStatut(Statut statut);
}
