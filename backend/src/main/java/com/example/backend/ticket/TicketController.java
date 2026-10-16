package com.example.backend.ticket;

import com.example.backend.ticket.dto.TicketCreateRequest;
import com.example.backend.ticket.dto.TicketResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TicketResponse creer(@Valid @RequestBody TicketCreateRequest request) {
        return service.creer(request);
    }

    @GetMapping
    public List<TicketResponse> lister(@RequestParam(required = false) Statut statut) {
        return service.lister(statut);
    }

    @PatchMapping("/{id}/fermer")
    public TicketResponse fermer(@PathVariable Long id) {
        return service.fermer(id);
    }
}
