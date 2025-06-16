package com.project.warehouse_management_system.WareHouse.controller;

import com.project.warehouse_management_system.BaseClasses.BaseController;
import com.project.warehouse_management_system.WareHouse.model.Position;
import com.project.warehouse_management_system.WareHouse.repo.PositionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("positions")
public class PositionController extends BaseController<Position,Long> {

    @Autowired
    private PositionRepo positionRepo;

    @GetMapping("/empty")
    public List<Position> getEmptyPositions() {
        return positionRepo.findByIsEmptyTrue();
    }
}
