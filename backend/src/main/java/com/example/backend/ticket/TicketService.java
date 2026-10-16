package com.example.backend.ticket;

import com.example.backend.ticket.dto.TicketCreateRequest;
import com.example.backend.ticket.dto.TicketResponse;
import com.example.backend.ticket.exception.TicketDejaFermeException;
import com.example.backend.ticket.exception.TicketNotFoundException;
import com.example.backend.ticket.exception.TitreDejaUtiliseException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository repository;

    public TicketService(TicketRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public TicketResponse creer(TicketCreateRequest request) {
        String titre = request.titre().trim();
        if (repository.existsByTitre(titre)) {
            throw new TitreDejaUtiliseException(titre);
        }
        try {
            Ticket ticket = repository.saveAndFlush(new Ticket(titre, request.description()));
            return toResponse(ticket);
        } catch (DataIntegrityViolationException e) {
            // filet de sécurité si deux requêtes simultanées passent le existsByTitre
            throw new TitreDejaUtiliseException(titre);
        }
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> lister(Statut statut) {
        List<Ticket> tickets = (statut == null)
                ? repository.findAll()
                : repository.findByStatut(statut);
        return tickets.stream().map(this::toResponse).toList();
    }

    @Transactional
    public TicketResponse fermer(Long id) {
        Ticket ticket = repository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
        if (ticket.getStatut() == Statut.FERME) {
            throw new TicketDejaFermeException(id);
        }
        ticket.fermer();
        return toResponse(ticket);
    }

    private TicketResponse toResponse(Ticket t) {
        return new TicketResponse(t.getId(), t.getTitre(), t.getDescription(),
                t.getStatut(), t.getDateCreation());
    }
}
