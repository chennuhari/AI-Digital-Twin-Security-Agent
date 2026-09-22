package com.digitaltwin.digital_twin_backend.recon;

import com.digitaltwin.digital_twin_backend.dto.ReconScanRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recon")
public class ReconController {

    private final ReconService reconService;

    public ReconController(ReconService reconService) {
        this.reconService = reconService;
    }

    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok(
                reconService.testRecon()
        );
    }

    @PostMapping("/scan")
    public ResponseEntity<List<String>> scan(
            @RequestBody ReconScanRequest request) throws Exception {

        List<String> results =
                reconService.scan(request.target());

        return ResponseEntity.ok(results);
    }
}