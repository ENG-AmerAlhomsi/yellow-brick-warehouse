package com.project.warehouse_management_system.WareHouse.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "Position")
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "position-name", nullable = false)
    private String positionName;

    @Column(name = "level", nullable = false)
    private int level;

    @Column(name = "is_empty")
    private Boolean isEmpty;

    @ManyToOne
    private Bay bay;

    @CreatedDate
    @Column(name = "created_at",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "last_modified",insertable = false)
    private LocalDateTime lastModified;
}
