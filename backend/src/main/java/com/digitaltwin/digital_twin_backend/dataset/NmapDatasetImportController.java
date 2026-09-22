package com.digitaltwin.digital_twin_backend.dataset;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/dataset")
public class NmapDatasetImportController {

    private final NmapDatasetImportService importService;

    public NmapDatasetImportController(
            NmapDatasetImportService importService) {
        this.importService = importService;
    }

    @PostMapping(
            value = "/nmap/import",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<NmapDatasetImportResponse> importNmapXml(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                importService.importXml(file)
        );
    }
}
