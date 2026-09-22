package com.digitaltwin.digital_twin_backend.collector;

import com.digitaltwin.digital_twin_backend.collector.dto.CollectorIngestResponse;
import com.digitaltwin.digital_twin_backend.collector.dto.CollectorMachineReport;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/collector")
public class CollectorController {

    private final CollectorService collectorService;

    public CollectorController(
            CollectorService collectorService) {

        this.collectorService = collectorService;
    }

    @PostMapping("/report")
    public ResponseEntity<CollectorIngestResponse> report(
            @RequestBody CollectorMachineReport report) {

        return ResponseEntity.ok(
                collectorService.ingest(report)
        );
    }
}