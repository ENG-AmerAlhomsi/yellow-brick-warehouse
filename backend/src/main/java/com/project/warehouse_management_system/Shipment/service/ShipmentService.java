package com.project.warehouse_management_system.Shipment.service;

import com.project.warehouse_management_system.BaseClasses.BaseService;
import com.project.warehouse_management_system.Shipment.model.Shipment;
import com.project.warehouse_management_system.Shipment.repo.ShipmentRepo;
import org.jboss.resteasy.annotations.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipmentService extends BaseService<Shipment,Long> {
    @Autowired
    private ShipmentRepo shipmentRepo;

    @Override
    protected void setEntityId(Shipment entity, Long id) {
        entity.setId(id);
    }

    /**
     * Find all shipments associated with a specific employee/user
     * @param userId The ID of the employee/user
     * @return List of shipments for the employee
     */
    public List<Shipment> getShipmentsByEmployeeId(String userId) {
        return shipmentRepo.findByShippingEmployee(userId);
    }


}
