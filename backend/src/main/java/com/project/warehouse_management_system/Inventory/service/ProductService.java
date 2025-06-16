package com.project.warehouse_management_system.Inventory.service;

import com.project.warehouse_management_system.BaseClasses.BaseService;
import com.project.warehouse_management_system.Inventory.model.Product;
import com.project.warehouse_management_system.Inventory.repo.ProductRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService extends BaseService<Product,Long> {

    @Autowired
    private ProductRepo productRepo;

    @Override
    protected void setEntityId(Product entity, Long id) {
        entity.setId(id);
    }

    @Override
    public Product getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }

        return productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    @Override
    public Product update(Long id, Product product) {
        // Ensure the product exists
        Product existingProduct = getById(id);

        // Update the fields that can be changed
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setWeight(product.getWeight());
        existingProduct.setQuantityInStock(product.getQuantityInStock());
        existingProduct.setUnitPrice(product.getUnitPrice());
        existingProduct.setBatchNumber(product.getBatchNumber());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setImageUrl(product.getImageUrl());

        return productRepo.save(existingProduct);
    }
}
