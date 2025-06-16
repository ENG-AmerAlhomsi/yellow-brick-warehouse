package com.project.warehouse_management_system.Inventory.repo;

import com.project.warehouse_management_system.BaseClasses.BaseRepo;
import com.project.warehouse_management_system.Inventory.model.PurchaseOrder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderRepo extends BaseRepo<PurchaseOrder, Long> {
    List<PurchaseOrder> findBySupplierName(String supplierName);
    List<PurchaseOrder> findByStatus(String status);
}
