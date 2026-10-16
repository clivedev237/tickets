package com.example.backend.ticket.exception;

public class TicketNotFoundException extends RuntimeException {
    public TicketNotFoundException(Long id) {
        super("Aucun ticket avec l'identifiant " + id + ".");
    }
}
