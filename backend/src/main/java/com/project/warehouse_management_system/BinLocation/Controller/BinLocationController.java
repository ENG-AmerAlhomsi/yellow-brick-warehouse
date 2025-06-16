package com.project.warehouse_management_system.BinLocation.Controller;

import com.project.warehouse_management_system.BinLocation.Model.BinLocation;
import com.project.warehouse_management_system.BinLocation.Service.BinLocationService;
import com.project.warehouse_management_system.BinLocation.Service.PdfGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/bin-locations")
public class BinLocationController {
    @Autowired
    private BinLocationService binLocationService;
    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateAndSaveBinLocations() {
        List<String> areas = Arrays.asList("A", "B"); // Define areas
        int rows = 16;
        int bays = 10;
        int levels = 3;
        List<String> positions = Arrays.asList("A", "B", "C","D","E");

        // Generate and save locations
        List<String> binCodes = binLocationService.generateBinLocations(areas, rows, bays, levels, positions);
        binLocationService.saveBinLocations(binCodes);

        return ResponseEntity.ok("Bin locations generated and saved successfully!");
    }

    @GetMapping("/generate-pdf")
    public ResponseEntity<String> generateStyledPdf() {
        List<BinLocation> binLocations = binLocationService.getAllBinLocations(); // Fetch from DB
        String outputPath = "styled_bin_locations.pdf";
        try {
            pdfGeneratorService.generateBinLocationsPdf(outputPath, binLocations);
            return ResponseEntity.ok("PDF with bin locations and QR codes generated successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate PDF.");
        }
    }
}

