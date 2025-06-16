package com.project.warehouse_management_system.BaseClasses;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;

@Repository
@NoRepositoryBean
public interface BaseRepo<T, ID> extends JpaRepository<T, ID> {
}
