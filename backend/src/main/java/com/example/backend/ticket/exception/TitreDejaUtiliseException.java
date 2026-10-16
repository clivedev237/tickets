package com.example.backend.ticket.exception;

public class TitreDejaUtiliseException extends RuntimeException {
    public TitreDejaUtiliseException(String titre) {
        super("RG-02 : un ticket avec le titre « " + titre + " » existe déjà.");
    }
}
