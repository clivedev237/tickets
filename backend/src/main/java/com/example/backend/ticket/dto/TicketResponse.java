package com.example.backend.ticket.dto;

import com.example.backend.ticket.Statut;
import java.time.LocalDateTime;

public record TicketResponse(
        Long id,
        String titre,
        String description,
        Statut statut,
        LocalDateTime dateCreation
) {}
