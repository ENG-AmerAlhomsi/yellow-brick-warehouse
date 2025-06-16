package com.project.warehouse_management_system.Shipment.repo;

import com.project.warehouse_management_system.BaseClasses.BaseRepo;
import com.project.warehouse_management_system.Shipment.model.Shipment;
import org.jboss.resteasy.annotations.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipmentRepo extends BaseRepo<Shipment,Long> {
    List<Shipment> findByShippingEmployee(String userId);
}
