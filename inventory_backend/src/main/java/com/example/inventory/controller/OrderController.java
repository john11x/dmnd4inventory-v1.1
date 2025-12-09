package com.example.inventory.controller;

import com.example.inventory.model.OrderEntity;
import com.example.inventory.dto.OrderDTO;
import com.example.inventory.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("user_id").toString());
            Long productId = Long.valueOf(body.get("product_id").toString());
            int quantity = Integer.parseInt(body.get("quantity").toString());

            OrderEntity order = orderService.placeOrder(userId, productId, quantity);
            return ResponseEntity.ok(Map.of("success", true, "message", "Order placed successfully", "orderId", order.getId()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "An error occurred while processing your order"));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            List<OrderEntity> orders = orderService.getAllOrdersWithJoins();
            List<OrderDTO> orderDTOs = orders.stream()
                .map(order -> new OrderDTO(
                    order.getId(),
                    order.getProductName(),
                    order.getQuantity(),
                    order.getTimestamp(),
                    "Pending" // Default status
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to retrieve orders"));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(orderService.getOrdersByUser(userId));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to retrieve user orders"));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getOrdersByProduct(@PathVariable Long productId) {
        try {
            return ResponseEntity.ok(orderService.getOrdersByProduct(productId));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to retrieve product orders"));
        }
    }
}