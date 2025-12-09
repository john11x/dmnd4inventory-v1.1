package com.example.inventory.model;

import jakarta.persistence.*;
import java.util.List;
import com.example.inventory.model.OrderEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Using default column name 'id'

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    private String role; // "ROLE_ADMIN" or "ROLE_USER"

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<OrderEntity> orders;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    // For backward compatibility
    public Long getUserId() { return id; }
    public void setUserId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public String getPassword() { return passwordHash; } // For compatibility
    public void setPassword(String password) { this.passwordHash = password; } // For compatibility
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public List<OrderEntity> getOrders() { return orders; }
    public void setOrders(List<OrderEntity> orders) { this.orders = orders; }
}
