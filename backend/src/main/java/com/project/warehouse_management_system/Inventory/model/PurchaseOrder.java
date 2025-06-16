package com.project.warehouse_management_system.Inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "purchase_orders")
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String supplierName;

    @Column(nullable = false)
    private Date expectedArrivalTime;

    @Column(nullable = false)
    private Double totalPrice;

    @Column(nullable = false)
    private String status = "Pending"; // Pending, Processing, Ready to Ship, Shipping

    @OneToMany(targetEntity = PurchaseOrderProduct.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    private List<PurchaseOrderProduct> products = new ArrayList<>();

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL)
    private List<Pallet> pallets = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "last_modified", insertable = false)
    private LocalDateTime lastModified;
}