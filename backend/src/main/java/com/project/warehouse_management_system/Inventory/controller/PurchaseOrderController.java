package com.project.warehouse_management_system.Inventory.controller;

import com.project.warehouse_management_system.BaseClasses.BaseController;
import com.project.warehouse_management_system.Inventory.Dto.PalletDTO;
import com.project.warehouse_management_system.Inventory.Dto.PurchaseOrderDTO;
import com.project.warehouse_management_system.Inventory.model.PurchaseOrder;
import com.project.warehouse_management_system.Inventory.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchase-orders")
public class PurchaseOrderController extends BaseController<PurchaseOrder, Long> {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @PostMapping
    @Operation(summary = "Create a new purchase order")
    public ResponseEntity<PurchaseOrderDTO> createPurchaseOrder(@RequestBody PurchaseOrderDTO purchaseOrderDTO) {
        return new ResponseEntity<>(purchaseOrderService.createPurchaseOrder(purchaseOrderDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update purchase order status")
    public ResponseEntity<PurchaseOrderDTO> updatePurchaseOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(purchaseOrderService.updatePurchaseOrderStatus(id, status));
    }

    @PostMapping("/{id}/pallets")
    @Operation(summary = "Add pallet to purchase order")
    public ResponseEntity<PurchaseOrderDTO> addPalletToPurchaseOrder(
            @PathVariable Long id,
            @RequestBody PalletDTO palletDTO) {
        return ResponseEntity.ok(purchaseOrderService.addPalletToPurchaseOrder(id, palletDTO));
    }

    @GetMapping("/supplier/{supplierName}")
    @Operation(summary = "Get purchase orders by supplier name")
    public ResponseEntity<List<PurchaseOrderDTO>> getPurchaseOrdersBySupplier(@PathVariable String supplierName) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersBySupplier(supplierName));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get purchase orders by status")
    public ResponseEntity<List<PurchaseOrderDTO>> getPurchaseOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrdersByStatus(status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get purchase order by ID")
    public ResponseEntity<PurchaseOrderDTO> getPurchaseOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.getPurchaseOrderById(id));
    }
}