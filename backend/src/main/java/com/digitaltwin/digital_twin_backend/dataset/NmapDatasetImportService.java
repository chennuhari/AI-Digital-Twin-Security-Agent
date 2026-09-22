package com.digitaltwin.digital_twin_backend.dataset;

import com.digitaltwin.digital_twin_backend.entity.Asset;
import com.digitaltwin.digital_twin_backend.entity.Port;
import com.digitaltwin.digital_twin_backend.service.AssetService;
import com.digitaltwin.digital_twin_backend.service.PortService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.*;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class NmapDatasetImportService {

    private final AssetService assetService;
    private final PortService portService;

    public NmapDatasetImportService(
            AssetService assetService,
            PortService portService) {
        this.assetService = assetService;
        this.portService = portService;
    }

    public NmapDatasetImportResponse importXml(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Nmap XML file is required.");
        }

        List<NmapDatasetHostResult> imported = new ArrayList<>();

        try (InputStream input = file.getInputStream()) {

            DocumentBuilderFactory factory =
                    DocumentBuilderFactory.newInstance();

            // Harden XML parsing: the importer must never resolve external entities.
            factory.setFeature(
                    "http://apache.org/xml/features/disallow-doctype-decl",
                    true
            );
            factory.setFeature(
                    "http://xml.org/sax/features/external-general-entities",
                    false
            );
            factory.setFeature(
                    "http://xml.org/sax/features/external-parameter-entities",
                    false
            );
            factory.setAttribute(
                    XMLConstants.ACCESS_EXTERNAL_DTD,
                    ""
            );
            factory.setAttribute(
                    XMLConstants.ACCESS_EXTERNAL_SCHEMA,
                    ""
            );
            factory.setXIncludeAware(false);
            factory.setExpandEntityReferences(false);

            Document document =
                    factory.newDocumentBuilder().parse(input);

            NodeList hosts = document.getElementsByTagName("host");

            int datasetNumber = 1;

            for (int i = 0; i < hosts.getLength(); i++) {

                Element host = (Element) hosts.item(i);

                if (!isUp(host)) {
                    continue;
                }

                List<ParsedPort> openPorts = parseOpenPorts(host);

                /*
                 * Do not retain/routinely expose the original Internet address
                 * from a public scan dataset. Each imported record receives an
                 * RFC 5737 documentation address instead.
                 */
                String datasetIp =
                        "198.51.100." + (((datasetNumber - 1) % 254) + 1);

                String hostname =
                        "dataset-host-" + datasetNumber;

                String operatingSystem = parseOperatingSystem(host);

                Asset asset = assetService.findByIpAddress(datasetIp)
                        .orElseGet(Asset::new);

                asset.setIpAddress(datasetIp);
                asset.setHostname(hostname);
                asset.setOperatingSystem(operatingSystem);
                asset.setMacAddress(null);
                asset.setStatus("DATASET");

                asset = assetService.saveAsset(asset);

                // Makes repeated imports idempotent for this dataset slot.
                portService.deletePortsByAssetId(asset.getId());

                for (ParsedPort parsed : openPorts) {
                    Port port = new Port();
                    port.setPortNumber(parsed.portNumber());
                    port.setProtocol(parsed.protocol());
                    port.setService(parsed.service());
                    port.setState("open");
                    port.setAsset(asset);

                    portService.savePort(port);
                }

                imported.add(
                        new NmapDatasetHostResult(
                                asset.getId(),
                                hostname,
                                datasetIp,
                                operatingSystem,
                                openPorts.size()
                        )
                );

                datasetNumber++;
            }

        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Unable to import Nmap XML: " + e.getMessage(),
                    e
            );
        }

        return new NmapDatasetImportResponse(
                imported.size(),
                imported,
                "Stored Nmap XML imported as DATASET assets. No target hosts were contacted."
        );
    }

    private boolean isUp(Element host) {
        NodeList statuses = host.getElementsByTagName("status");

        if (statuses.getLength() == 0) {
            return true;
        }

        Element status = (Element) statuses.item(0);
        return "up".equalsIgnoreCase(status.getAttribute("state"));
    }

    private List<ParsedPort> parseOpenPorts(Element host) {

        List<ParsedPort> result = new ArrayList<>();
        NodeList ports = host.getElementsByTagName("port");

        for (int i = 0; i < ports.getLength(); i++) {

            Element portElement = (Element) ports.item(i);

            NodeList states =
                    portElement.getElementsByTagName("state");

            if (states.getLength() == 0) {
                continue;
            }

            Element state = (Element) states.item(0);

            if (!"open".equalsIgnoreCase(
                    state.getAttribute("state"))) {
                continue;
            }

            String portId =
                    portElement.getAttribute("portid");

            if (portId == null || portId.isBlank()) {
                continue;
            }

            int portNumber;

            try {
                portNumber = Integer.parseInt(portId);
            } catch (NumberFormatException ex) {
                continue;
            }

            String protocol =
                    defaultText(
                            portElement.getAttribute("protocol"),
                            "tcp"
                    );

            String serviceName = "unknown";

            NodeList services =
                    portElement.getElementsByTagName("service");

            if (services.getLength() > 0) {
                Element service =
                        (Element) services.item(0);

                serviceName =
                        defaultText(
                                service.getAttribute("name"),
                                "unknown"
                        );
            }

            result.add(
                    new ParsedPort(
                            portNumber,
                            protocol,
                            serviceName
                    )
            );
        }

        return result;
    }

    private String parseOperatingSystem(Element host) {

        NodeList osMatches =
                host.getElementsByTagName("osmatch");

        if (osMatches.getLength() > 0) {
            Element osMatch =
                    (Element) osMatches.item(0);

            String name =
                    osMatch.getAttribute("name");

            if (name != null && !name.isBlank()) {
                return name;
            }
        }

        return "Dataset / Unknown OS";
    }

    private String defaultText(
            String value,
            String fallback) {

        return value == null || value.isBlank()
                ? fallback
                : value;
    }

    private record ParsedPort(
            int portNumber,
            String protocol,
            String service) {
    }
}
