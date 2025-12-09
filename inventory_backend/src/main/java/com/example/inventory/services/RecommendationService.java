package com.example.inventory.services;

import com.example.inventory.model.Product;
import com.example.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    private final ProductRepository productRepository;
    private final MlPredictionService mlPredictionService;
    
    public RecommendationService(ProductRepository productRepository, 
                                 MlPredictionService mlPredictionService) {
        this.productRepository = productRepository;
        this.mlPredictionService = mlPredictionService;
    }
    
    /**
     * Get recommended products based on ML predictions
     * @param limit Maximum number of recommendations
     * @return List of products with predicted demand
     */
    public List<ProductRecommendation> getRecommendations(int limit) {
        List<Product> allProducts = productRepository.findAll();
        
        List<ProductRecommendation> recommendations = allProducts.stream()
            .map(product -> {
                Double predictedDemand = mlPredictionService.predictDemand(
                    product.getProductId(),
                    product.getStockLevel(),
                    product.getPrice(),
                    product.getCategory(),
                    product.getSkuId()
                );
                
                return new ProductRecommendation(product, predictedDemand);
            })
            .sorted((a, b) -> Double.compare(b.getPredictedDemand(), a.getPredictedDemand()))
            .limit(limit)
            .collect(Collectors.toList());
        
        return recommendations;
    }
    
    /**
     * Get featured products (high stock, good price, popular categories)
     */
    public List<Product> getFeaturedProducts(int limit) {
        return productRepository.findAll().stream()
            .filter(p -> p.getStockLevel() != null && p.getStockLevel() > 10)
            .filter(p -> p.getPrice() != null && p.getPrice() > 0)
            .sorted((a, b) -> {
                // Sort by stock level (higher first), then by price (lower first)
                int stockCompare = Integer.compare(
                    b.getStockLevel() != null ? b.getStockLevel() : 0,
                    a.getStockLevel() != null ? a.getStockLevel() : 0
                );
                if (stockCompare != 0) return stockCompare;
                return Double.compare(
                    a.getPrice() != null ? a.getPrice() : Double.MAX_VALUE,
                    b.getPrice() != null ? b.getPrice() : Double.MAX_VALUE
                );
            })
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    /**
     * Get low stock alerts (products that need restocking)
     */
    public List<Product> getLowStockProducts(int threshold) {
        return productRepository.findAll().stream()
            .filter(p -> p.getStockLevel() != null && p.getStockLevel() <= threshold)
            .sorted((a, b) -> Integer.compare(
                a.getStockLevel() != null ? a.getStockLevel() : 0,
                b.getStockLevel() != null ? b.getStockLevel() : 0
            ))
            .collect(Collectors.toList());
    }
    
    /**
     * Inner class to hold product with prediction
     */
    public static class ProductRecommendation {
        private final Product product;
        private final Double predictedDemand;
        
        public ProductRecommendation(Product product, Double predictedDemand) {
            this.product = product;
            this.predictedDemand = predictedDemand != null ? predictedDemand : 0.0;
        }
        
        public Product getProduct() {
            return product;
        }
        
        public Double getPredictedDemand() {
            return predictedDemand;
        }
    }
}

