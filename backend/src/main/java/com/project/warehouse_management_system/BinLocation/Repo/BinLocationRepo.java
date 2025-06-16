package com.project.warehouse_management_system.BinLocation.Repo;

import com.project.warehouse_management_system.BinLocation.Model.BinLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BinLocationRepo extends JpaRepository<BinLocation, Long> {
}
