package com.digitaltwin.digital_twin_backend.controller;

import com.digitaltwin.digital_twin_backend.dto.PortResponse;
import com.digitaltwin.digital_twin_backend.entity.Asset;
import com.digitaltwin.digital_twin_backend.entity.Port;
import com.digitaltwin.digital_twin_backend.service.AssetService;
import com.digitaltwin.digital_twin_backend.service.PortService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;
    private final PortService portService;

    public AssetController(
            AssetService assetService,
            PortService portService) {

        this.assetService = assetService;
        this.portService = portService;
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(
            @RequestBody Asset asset) {

        return ResponseEntity.ok(
                assetService.saveAsset(asset)
        );
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {

        return ResponseEntity.ok(
                assetService.getAllAssets()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(
            @PathVariable Long id) {

        return assetService.getAssetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/ports")
    public ResponseEntity<List<PortResponse>> getAssetPorts(
            @PathVariable Long id) {

        if (assetService.getAssetById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Port> ports =
                portService.getPortsByAssetId(id);

        List<PortResponse> response =
                ports.stream()
                        .map(port -> new PortResponse(
                                port.getId(),
                                port.getPortNumber(),
                                port.getProtocol(),
                                port.getService(),
                                port.getState()
                        ))
                        .toList();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(
            @PathVariable Long id) {

        assetService.deleteAsset(id);

        return ResponseEntity.noContent().build();
    }
}