package com.digitaltwin.digital_twin_backend.history;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/history")
public class ScanHistoryController {
    private final ScanHistoryService service;

    public ScanHistoryController(ScanHistoryService service) {
        this.service = service;
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ScanHistory>> recent() {
        return ResponseEntity.ok(service.getRecentHistory());
    }
}