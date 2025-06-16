package com.project.warehouse_management_system.WareHouse.service;

import com.project.warehouse_management_system.BaseClasses.BaseService;
import com.project.warehouse_management_system.WareHouse.model.Location;
import org.springframework.stereotype.Service;

@Service
public class LocationService extends BaseService<Location,Long> {
    @Override
    protected void setEntityId(Location entity, Long id) {
        entity.setId(id);
    }
}
