package com.example.inventory.services;

import com.example.inventory.model.OrderEntity;
import com.example.inventory.model.Product;
import com.example.inventory.model.User;
import com.example.inventory.repository.OrderRepository;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, 
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderEntity placeOrder(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
            
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));
            
        if (product.getStockLevel() == null || product.getStockLevel() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName() + 
                                             ". Available: " + (product.getStockLevel() != null ? product.getStockLevel() : 0));
        }
        
        // Update product stock
        product.setStockLevel(product.getStockLevel() - quantity);
        productRepository.save(product);

        // Create and save order
        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(quantity);
        
        return orderRepository.save(order);
    }

    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<OrderEntity> getAllOrdersWithJoins() {
        List<OrderEntity> orders = orderRepository.findAll();
        // Force initialization of lazy relationships
        orders.forEach(order -> {
            order.getUser(); // Initialize user
            order.getProduct(); // Initialize product
        });
        return orders;
    }

    public List<OrderEntity> getOrdersByUser(Long userId) {
        return orderRepository.findByUser_Id(userId);
    }

    public List<OrderEntity> getOrdersByProduct(Long productId) {
        return orderRepository.findByProduct_Id(productId);
    }
}