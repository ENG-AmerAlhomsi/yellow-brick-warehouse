package com.project.warehouse_management_system.Inventory.repo;

import com.project.warehouse_management_system.BaseClasses.BaseRepo;
import com.project.warehouse_management_system.Inventory.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends BaseRepo<Orders,Long> {
    List<Orders> findByUserId(String userId);
}
