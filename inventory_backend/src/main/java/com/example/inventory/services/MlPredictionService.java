package com.example.inventory.services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.*;

@Service
public class MlPredictionService {
    private static final Logger logger = LoggerFactory.getLogger(MlPredictionService.class);
    
    @Value("${ml.model.path:../ml/demand_model.joblib}")
    private String modelPath;
    
    @Value("${ml.python.path:python3}")
    private String pythonPath;
    
    /**
     * Predicts demand quantity for a product using the ML model
     * @param productId Product ID
     * @param currentStock Current stock level
     * @param price Product price
     * @param category Product category
     * @param skuId SKU identifier
     * @return Predicted demand quantity
     */
    public Double predictDemand(Long productId, Integer currentStock, Double price, String category, String skuId) {
        try {
            // Get the script path (relative to project root)
            File projectRoot = new File(System.getProperty("user.dir"));
            File scriptFile = new File(projectRoot, "../ml/predict_demand.py");
            if (!scriptFile.exists()) {
                // Try alternative path
                scriptFile = new File(projectRoot.getParentFile(), "ml/predict_demand.py");
            }
            
            if (!scriptFile.exists()) {
                logger.warn("Python prediction script not found, using fallback calculation");
                return calculateFallbackDemand(currentStock, price);
            }
            
            // Execute Python script
            ProcessBuilder pb = new ProcessBuilder(
                pythonPath,
                scriptFile.getAbsolutePath(),
                String.valueOf(productId),
                String.valueOf(currentStock != null ? currentStock : 50),
                String.valueOf(price != null ? price : 100.0),
                skuId != null ? skuId : ""
            );
            pb.directory(scriptFile.getParentFile());
            pb.redirectErrorStream(true);
            
            Process process = pb.start();
            
            // Read output
            StringBuilder output = new StringBuilder();
            StringBuilder errorOutput = new StringBuilder();
            
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));
                 BufferedReader errorReader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.startsWith("ERROR")) {
                        errorOutput.append(line).append("\n");
                    } else {
                        output.append(line).append("\n");
                    }
                }
                while ((line = errorReader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
            }
            
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                logger.error("Python script failed with exit code: {}", exitCode);
                logger.error("Error output: {}", errorOutput.toString());
                return calculateFallbackDemand(currentStock, price);
            }
            
            // Parse prediction from output
            String result = output.toString().trim();
            // Remove any error messages that might be in output
            String[] lines = result.split("\n");
            String lastLine = lines[lines.length - 1];
            
            try {
                double prediction = Double.parseDouble(lastLine);
                return Math.max(0, prediction); // Ensure non-negative
            } catch (NumberFormatException e) {
                logger.error("Failed to parse prediction result: {}", result);
                return calculateFallbackDemand(currentStock, price);
            }
            
        } catch (Exception e) {
            logger.error("Error predicting demand", e);
            return calculateFallbackDemand(currentStock, price);
        }
    }
    
    private Double calculateFallbackDemand(Integer currentStock, Double price) {
        // Simple heuristic: higher stock and lower price = higher predicted demand
        if (currentStock == null) currentStock = 50;
        if (price == null) price = 100.0;
        
        // Base demand on stock level and inverse price relationship
        double baseDemand = currentStock * 0.3;
        double priceFactor = Math.max(0.1, 500.0 / Math.max(price, 1.0));
        return baseDemand * priceFactor;
    }
}

