package com.project.warehouse_management_system.Shipment.service;

import com.project.warehouse_management_system.BaseClasses.BaseService;
import com.project.warehouse_management_system.Shipment.model.Truck;
import org.springframework.stereotype.Service;

@Service
public class TruckService extends BaseService<Truck,Long> {
    @Override
    protected void setEntityId(Truck entity, Long id) {
        entity.setId(id);
    }
}
