package com.project.warehouse_management_system.WareHouse.repo;

import com.project.warehouse_management_system.BaseClasses.BaseRepo;
import com.project.warehouse_management_system.WareHouse.model.Position;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionRepo extends BaseRepo<Position,Long> {
    List<Position> findByIsEmptyTrue();
}
