package com.digitaltwin.digital_twin_backend.repository;

import com.digitaltwin.digital_twin_backend.entity.Port;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortRepository extends JpaRepository<Port, Long> {

    List<Port> findByAssetId(Long assetId);
}