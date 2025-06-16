package com.project.warehouse_management_system.Inventory.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderProductDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private String expectedPallets;
    private BigDecimal price;
}