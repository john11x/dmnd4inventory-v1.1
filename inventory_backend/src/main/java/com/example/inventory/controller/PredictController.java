package com.example.inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Map;

@RestController
@RequestMapping("/api/predict")
public class PredictController {

    @GetMapping("/{productId}")
    public ResponseEntity<?> predictDemand(@PathVariable Long productId,
                                           @RequestParam Integer currentStock,
                                           @RequestParam Double price) {
        try {
            // Build command to run ML prediction script
            ProcessBuilder pb = new ProcessBuilder(
                "/opt/anaconda3/bin/python3",
                "ml/predict.py",
                productId.toString(),
                currentStock.toString(),
                price.toString()
            );
            pb.directory(new java.io.File(System.getProperty("user.dir")).getParentFile());
            pb.redirectErrorStream(true);

            Process process = pb.start();
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Prediction script failed", "details", output.toString()));
            }

            // Take the last non‑empty line as the prediction
            String[] lines = output.toString().trim().split("\n");
            String raw = "";
            for (int i = lines.length - 1; i >= 0; i--) {
                if (!lines[i].trim().isEmpty()) {
                    raw = lines[i].trim();
                    break;
                }
            }
            double prediction = Double.parseDouble(raw);

            return ResponseEntity.ok(Map.of(
                "productId", productId,
                "predictedDemand", Math.max(0, prediction)
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Failed to run prediction", "details", e.getMessage()));
        }
    }
}
