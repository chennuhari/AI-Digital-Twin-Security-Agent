package com.digitaltwin.digital_twin_backend.service;

import com.digitaltwin.digital_twin_backend.entity.Port;
import com.digitaltwin.digital_twin_backend.repository.PortRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortService {

    private final PortRepository portRepository;

    public PortService(PortRepository portRepository) {
        this.portRepository = portRepository;
    }

    public Port savePort(Port port) {
        return portRepository.save(port);
    }

    public List<Port> getPortsByAssetId(Long assetId) {
        return portRepository.findByAssetId(assetId);
    }

    public void deletePortsByAssetId(Long assetId) {
        List<Port> ports = portRepository.findByAssetId(assetId);
        portRepository.deleteAll(ports);
    }
}