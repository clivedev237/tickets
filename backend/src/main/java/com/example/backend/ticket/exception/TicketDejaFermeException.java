package com.example.backend.ticket.exception;

public class TicketDejaFermeException extends RuntimeException {
    public TicketDejaFermeException(Long id) {
        super("RG-03 : le ticket " + id + " est déjà FERME, il ne peut plus changer d'état.");
    }
}
