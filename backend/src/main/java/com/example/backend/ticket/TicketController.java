package com.example.backend.ticket;

import com.example.backend.ticket.dto.TicketCreateRequest;
import com.example.backend.ticket.dto.TicketResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "Création, consultation et fermeture des tickets de support")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @Operation(summary = "Créer un ticket",
            description = "Le client envoie uniquement titre et description. Le statut (OUVERT) et la date sont fixés par le serveur.")
    @ApiResponse(responseCode = "201", description = "Ticket créé")
    @ApiResponse(responseCode = "400", description = "Titre absent ou de plus de 100 caractères (RG-01)")
    @ApiResponse(responseCode = "409", description = "Un ticket avec le même titre existe déjà (RG-02)")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TicketResponse creer(@Valid @RequestBody TicketCreateRequest request) {
        return service.creer(request);
    }

    @Operation(summary = "Lister les tickets",
            description = "Filtrable par statut avec le paramètre optionnel ?statut=OUVERT|EN_COURS|FERME.")
    @ApiResponse(responseCode = "200", description = "Liste des tickets (éventuellement vide)")
    @ApiResponse(responseCode = "400", description = "Valeur de statut invalide")
    @GetMapping
    public List<TicketResponse> lister(@RequestParam(required = false) Statut statut) {
        return service.lister(statut);
    }

    @Operation(summary = "Fermer un ticket",
            description = "Possible uniquement si le ticket est OUVERT ou EN_COURS.")
    @ApiResponse(responseCode = "200", description = "Ticket fermé")
    @ApiResponse(responseCode = "404", description = "Aucun ticket avec cet identifiant")
    @ApiResponse(responseCode = "409", description = "Le ticket est déjà FERME (RG-03)")
    @PatchMapping("/{id}/fermer")
    public TicketResponse fermer(@PathVariable Long id) {
        return service.fermer(id);
    }
}
