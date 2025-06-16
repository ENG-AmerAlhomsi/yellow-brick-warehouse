package com.project.warehouse_management_system.Inventory.service;

import com.project.warehouse_management_system.BaseClasses.BaseService;
import com.project.warehouse_management_system.Inventory.Dto.PalletDTO;
import com.project.warehouse_management_system.Inventory.Dto.PurchaseOrderDTO;
import com.project.warehouse_management_system.Inventory.Dto.PurchaseOrderProductDTO;
import com.project.warehouse_management_system.Inventory.model.Pallet;
import com.project.warehouse_management_system.Inventory.model.Product;
import com.project.warehouse_management_system.Inventory.model.PurchaseOrder;
import com.project.warehouse_management_system.Inventory.model.PurchaseOrderProduct;
import com.project.warehouse_management_system.Inventory.repo.ProductRepo;
import com.project.warehouse_management_system.Inventory.repo.PurchaseOrderRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PurchaseOrderService extends BaseService<PurchaseOrder, Long> {

    @Autowired
    private PurchaseOrderRepo purchaseOrderRepository;

    @Autowired
    private ProductRepo productRepository;

    @Override
    protected void setEntityId(PurchaseOrder entity, Long id) {
        entity.setId(id);
    }

    @Transactional
    public PurchaseOrderDTO createPurchaseOrder(PurchaseOrderDTO purchaseOrderDTO) {
        PurchaseOrder purchaseOrder = new PurchaseOrder();
        purchaseOrder.setSupplierName(purchaseOrderDTO.getSupplierName());
        purchaseOrder.setExpectedArrivalTime(purchaseOrderDTO.getExpectedArrivalTime());
        purchaseOrder.setTotalPrice(purchaseOrderDTO.getTotalPrice());
        purchaseOrder.setStatus("Pending");

        // Add products to purchase order
        if (purchaseOrderDTO.getProducts() != null) {
            List<PurchaseOrderProduct> products = new ArrayList<>();
            for (PurchaseOrderProductDTO productDTO : purchaseOrderDTO.getProducts()) {
                PurchaseOrderProduct orderProduct = new PurchaseOrderProduct();

                Product product = productRepository.findById(productDTO.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("Product not found"));

                orderProduct.setProduct(product);
                orderProduct.setQuantity(productDTO.getQuantity());
                orderProduct.setExpectedPallets(productDTO.getExpectedPallets());
                orderProduct.setPrice(product.getUnitPrice());

                products.add(orderProduct);
            }
            purchaseOrder.setProducts(products);
        }

        // Save purchase order with products
        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        return mapToDTO(purchaseOrder);
    }

    @Transactional
    public PurchaseOrderDTO updatePurchaseOrderStatus(Long id, String status) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Purchase order not found"));

        // Validate status transition
        String currentStatus = purchaseOrder.getStatus();
        if (!isValidStatusTransition(currentStatus, status)) {
            throw new IllegalStateException("Invalid status transition from " + currentStatus + " to " + status);
        }

        purchaseOrder.setStatus(status);
        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        return mapToDTO(purchaseOrder);
    }

    private boolean isValidStatusTransition(String currentStatus, String newStatus) {
        switch (currentStatus) {
            case "Pending":
                return newStatus.equals("Processing");
            case "Processing":
                return newStatus.equals("Ready to Ship");
            case "Ready to Ship":
                return newStatus.equals("Shipping");
            default:
                return false;
        }
    }

    @Transactional
    public PurchaseOrderDTO addPalletToPurchaseOrder(Long purchaseOrderId, PalletDTO palletDTO) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(purchaseOrderId)
                .orElseThrow(() -> new EntityNotFoundException("Purchase order not found"));

        // Check if purchase order is in a valid state to add pallets
        if (!purchaseOrder.getStatus().equals("Processing")) {
            throw new IllegalStateException("Cannot add pallets to purchase order in " + purchaseOrder.getStatus() + " status");
        }

        Product product = productRepository.findById(palletDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        Pallet pallet = new Pallet();
        pallet.setPalletName(palletDTO.getPalletName());
        pallet.setQuantity(palletDTO.getQuantity());
        pallet.setMaximumCapacity(palletDTO.getMaximumCapacity());
        pallet.setStatus("Ready to Ship");
        pallet.setManufacturingDate(palletDTO.getManufacturingDate());
        pallet.setExpiryDate(palletDTO.getExpiryDate());
        pallet.setSupplierName(purchaseOrder.getSupplierName()); // Auto-set supplier name from purchase order
        pallet.setProduct(product);
        pallet.setPurchaseOrder(purchaseOrder);

        purchaseOrder.getPallets().add(pallet);
        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        return mapToDTO(purchaseOrder);
    }

    public List<PurchaseOrderDTO> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<PurchaseOrderDTO> getPurchaseOrdersBySupplier(String supplierName) {
        return purchaseOrderRepository.findBySupplierName(supplierName).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<PurchaseOrderDTO> getPurchaseOrdersByStatus(String status) {
        return purchaseOrderRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PurchaseOrderDTO getPurchaseOrderById(Long id) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Purchase order not found"));
        return mapToDTO(purchaseOrder);
    }

    private PurchaseOrderDTO mapToDTO(PurchaseOrder purchaseOrder) {
        PurchaseOrderDTO dto = new PurchaseOrderDTO();
        dto.setId(purchaseOrder.getId());
        dto.setSupplierName(purchaseOrder.getSupplierName());
        dto.setExpectedArrivalTime(purchaseOrder.getExpectedArrivalTime());
        dto.setTotalPrice(purchaseOrder.getTotalPrice());
        dto.setStatus(purchaseOrder.getStatus());

        // Map products
        if (purchaseOrder.getProducts() != null) {
            List<PurchaseOrderProductDTO> productDTOs = purchaseOrder.getProducts().stream()
                    .map(product -> {
                        PurchaseOrderProductDTO productDTO = new PurchaseOrderProductDTO();
                        productDTO.setId(product.getId());
                        productDTO.setProductId(product.getProduct().getId());
                        productDTO.setProductName(product.getProduct().getName());
                        productDTO.setQuantity(product.getQuantity());
                        productDTO.setExpectedPallets(product.getExpectedPallets());
                        productDTO.setPrice(product.getPrice());
                        return productDTO;
                    })
                    .collect(Collectors.toList());
            dto.setProducts(productDTOs);
        }

        // Map pallets
        if (purchaseOrder.getPallets() != null) {
            List<PalletDTO> palletDTOs = purchaseOrder.getPallets().stream()
                    .map(pallet -> {
                        PalletDTO palletDTO = new PalletDTO();
                        palletDTO.setId(pallet.getId());
                        palletDTO.setPalletName(pallet.getPalletName());
                        palletDTO.setQuantity(pallet.getQuantity());
                        palletDTO.setMaximumCapacity(pallet.getMaximumCapacity());
                        palletDTO.setStatus(pallet.getStatus());
                        palletDTO.setManufacturingDate(pallet.getManufacturingDate());
                        palletDTO.setExpiryDate(pallet.getExpiryDate());
                        palletDTO.setSupplierName(pallet.getSupplierName());
                        palletDTO.setProductId(pallet.getProduct().getId());
                        palletDTO.setProductName(pallet.getProduct().getName());
                        palletDTO.setPurchaseOrderId(purchaseOrder.getId());
                        return palletDTO;
                    })
                    .collect(Collectors.toList());
            dto.setPallets(palletDTOs);
        }

        return dto;
    }
}