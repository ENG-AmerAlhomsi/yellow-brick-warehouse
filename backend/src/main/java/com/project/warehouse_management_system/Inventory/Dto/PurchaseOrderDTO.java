package com.project.warehouse_management_system.Inventory.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderDTO {
    private Long id;
    private String supplierName;
    private Date expectedArrivalTime;
    private Double totalPrice;
    private String status;
    private List<PurchaseOrderProductDTO> products;
    private List<PalletDTO> pallets;
}
