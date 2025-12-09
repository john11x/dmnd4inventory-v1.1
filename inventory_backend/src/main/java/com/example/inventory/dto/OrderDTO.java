package com.example.inventory.dto;

import java.time.Instant;

public class OrderDTO {
    private Long id;
    private String productName;
    private Integer quantity;
    private Instant timestamp;
    private String status;

    public OrderDTO() {}

    public OrderDTO(Long id, String productName, Integer quantity, Instant timestamp, String status) {
        this.id = id;
        this.productName = productName;
        this.quantity = quantity;
        this.timestamp = timestamp;
        this.status = status;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
