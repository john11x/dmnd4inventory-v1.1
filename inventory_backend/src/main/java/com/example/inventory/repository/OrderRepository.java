package com.example.inventory.repository;

import com.example.inventory.model.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUser_Id(Long userId);
    List<OrderEntity> findByProduct_Id(Long productId);
}