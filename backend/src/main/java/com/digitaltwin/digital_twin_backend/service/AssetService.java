package com.digitaltwin.digital_twin_backend.service;

import com.digitaltwin.digital_twin_backend.entity.Asset;
import com.digitaltwin.digital_twin_backend.repository.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Optional<Asset> findByIpAddress(String ipAddress) {
        return assetRepository.findByIpAddress(ipAddress);
    }

    public Optional<Asset> getAssetById(Long id) {
        return assetRepository.findById(id);
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }
}