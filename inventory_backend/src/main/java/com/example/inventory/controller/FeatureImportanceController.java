package com.example.inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;

@RestController
@RequestMapping("/api/feature-importance")
public class FeatureImportanceController {

    @GetMapping
    public ResponseEntity<?> getFeatureImportance() {
        try {
            // Build command to run Python feature importance script
            ProcessBuilder pb = new ProcessBuilder(
                "/opt/anaconda3/bin/python3",
                "ml/feature_importance.py"
            );
            pb.directory(new java.io.File(System.getProperty("user.dir")).getParentFile());
            pb.redirectErrorStream(true);

            Process process = pb.start();
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Feature importance extraction failed", "details", output.toString()));
            }

            // Parse JSON output
            String jsonOutput = output.toString().trim();
            
            // Return the feature importance data
            return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(jsonOutput);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to extract feature importance", "details", e.getMessage()));
        }
    }
}
