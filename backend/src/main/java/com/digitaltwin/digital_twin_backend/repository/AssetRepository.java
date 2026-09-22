package com.digitaltwin.digital_twin_backend.repository;

import com.digitaltwin.digital_twin_backend.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findByIpAddress(String ipAddress);
}