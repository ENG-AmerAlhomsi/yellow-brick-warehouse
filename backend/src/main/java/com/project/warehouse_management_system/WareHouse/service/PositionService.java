package com.project.warehouse_management_system.WareHouse.service;

import com.project.warehouse_management_system.BaseClasses.BaseService;
import com.project.warehouse_management_system.WareHouse.model.Position;
import org.springframework.stereotype.Service;

@Service
public class PositionService extends BaseService<Position,Long> {
    @Override
    protected void setEntityId(Position entity, Long id) {
        entity.setId(id);
    }
}
