package com.project.warehouse_management_system.Inventory.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PalletDTO {
    private Long id;
    private String palletName;
    private int quantity;
    private int maximumCapacity;
    private String status;
    private Date manufacturingDate;
    private Date expiryDate;
    private String supplierName;
    private Long productId;
    private String productName;
    private Long purchaseOrderId;
}