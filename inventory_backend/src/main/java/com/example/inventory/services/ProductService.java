package com.example.inventory.services;

import com.example.inventory.model.Product;
import com.example.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;
    public ProductService(ProductRepository repo) { this.repo = repo; }

    public List<Product> getAll() { return repo.findAll(); }
    public Product getById(Long id) { return repo.findById(id).orElseThrow(); }
    public Product create(Product p) { return repo.save(p); }
    public Product update(Long id, Product p) {
        Product existing = getById(id);
        existing.setName(p.getName());
        existing.setCategory(p.getCategory());
        existing.setPrice(p.getPrice());
        existing.setStockLevel(p.getStockLevel());
        if (p.getDescription() != null) existing.setDescription(p.getDescription());
        if (p.getImageUrl() != null) existing.setImageUrl(p.getImageUrl());
        if (p.getSkuId() != null) existing.setSkuId(p.getSkuId());
        return repo.save(existing);
    }
    public void delete(Long id) { repo.deleteById(id); }
}
