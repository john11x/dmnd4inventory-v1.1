package com.example.inventory.controller;

import com.example.inventory.model.Product;
import com.example.inventory.services.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    
    private final RecommendationService recommendationService;
    
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(
            @RequestParam(defaultValue = "10") int limit) {
        List<RecommendationService.ProductRecommendation> recommendations = 
            recommendationService.getRecommendations(limit);
        
        List<Map<String, Object>> result = recommendations.stream()
            .map(rec -> {
                Map<String, Object> item = new HashMap<>();
                Product p = rec.getProduct();
                item.put("productId", p.getProductId());
                item.put("name", p.getName());
                item.put("category", p.getCategory());
                item.put("price", p.getPrice());
                item.put("stockLevel", p.getStockLevel());
                item.put("description", p.getDescription());
                item.put("imageUrl", p.getImageUrl());
                item.put("predictedDemand", rec.getPredictedDemand());
                return item;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts(
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(recommendationService.getFeaturedProducts(limit));
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(recommendationService.getLowStockProducts(threshold));
    }
}

