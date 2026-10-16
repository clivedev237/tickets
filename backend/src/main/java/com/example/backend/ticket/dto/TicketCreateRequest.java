package com.example.backend.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TicketCreateRequest(
        @NotBlank(message = "Le titre est obligatoire (RG-01).")
        @Size(max = 100, message = "Le titre ne doit pas dépasser 100 caractères (RG-01).")
        String titre,

        String description
) {}
