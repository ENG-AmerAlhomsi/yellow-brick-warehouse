package com.project.warehouse_management_system;

import com.project.warehouse_management_system.WareHouse.controller.LocationController;
import com.project.warehouse_management_system.WareHouse.model.*;
import com.project.warehouse_management_system.WareHouse.repo.RowRepo;
import com.project.warehouse_management_system.WareHouse.repo.LocationRepo;
import com.project.warehouse_management_system.WareHouse.repo.AreaRepo;
import com.project.warehouse_management_system.WareHouse.service.LocationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
@Rollback
public class TestModels {
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private LocationRepo locationRepo;
    @Autowired
    private LocationController locationController;
    @Autowired
    private LocationService locationService;
    @Autowired
    private AreaRepo areaRepo;
    @Autowired
    private RowRepo rowRepo;

    @Test
    public void testCreateLocation() {
        Location location = new Location();
        location.setLocationName("Warehouse A");
        location.setLongitude("45.4215");
        location.setLatitude("-75.6903");
        location.setCreatedAt(LocalDateTime.now());

         locationController.createNew(location);
         locationService.create(location);
         Location savedLocation = locationRepo.save(location);

        // Verify the persisted entity
        assertNotNull(savedLocation.getId()); // Ensure the ID was generated
        assertEquals("Warehouse A", savedLocation.getLocationName());
        assertEquals("45.4215", savedLocation.getLongitude());
        assertEquals("-75.6903", savedLocation.getLatitude());
    }

    @Test
    public void testDeleteLocation() {
        Location location = new Location();
        location.setLocationName("Warehouse B");
        location.setLongitude("45.4215");
        location.setLatitude("-75.6903");
        location.setCreatedAt(LocalDateTime.now());

        Location savedLocation = locationRepo.save(location);
        Long locationId = savedLocation.getId();

        // Delete the location
        locationRepo.deleteById(locationId);

        // Verify the location was deleted
        Optional<Location> deletedLocation = locationRepo.findById(locationId);
        assertFalse(deletedLocation.isPresent());
    }

    @Test
    public void testCreateNewList() {
        Location location1 = new Location();
        location1.setLocationName("Warehouse C");
        location1.setLongitude("45.4215");
        location1.setLatitude("-75.6903");
        location1.setCreatedAt(LocalDateTime.now());

        Location location2 = new Location();
        location2.setLocationName("Warehouse D");
        location2.setLongitude("50.1109");
        location2.setLatitude("-100.8839");
        location2.setCreatedAt(LocalDateTime.now());

        // Save the locations
        locationRepo.saveAll(Arrays.asList(location1, location2));

        // Retrieve all locations
        List<Location> allLocations = locationRepo.findAll();  // This line defines allLocations

        // Verify the list contains at least 2 locations
        assertTrue(allLocations.size() >= 2);

        // Verify the data for each specific location
        Location savedLocation1 = allLocations.stream()
                .filter(loc -> "Warehouse C".equals(loc.getLocationName()))
                .findFirst()
                .orElse(null);

        Location savedLocation2 = allLocations.stream()
                .filter(loc -> "Warehouse D".equals(loc.getLocationName()))
                .findFirst()
                .orElse(null);

        assertNotNull(savedLocation1);
        assertEquals("45.4215", savedLocation1.getLongitude());
        assertEquals("-75.6903", savedLocation1.getLatitude());

        assertNotNull(savedLocation2);
        assertEquals("50.1109", savedLocation2.getLongitude());
        assertEquals("-100.8839", savedLocation2.getLatitude());
    }

    @Test
    public void testGetAllLocations() {
        Location location1 = new Location();
        location1.setLocationName("Warehouse E");
        location1.setLongitude("12.4964");
        location1.setLatitude("41.9028");
        location1.setCreatedAt(LocalDateTime.now());

        Location location2 = new Location();
        location2.setLocationName("Warehouse F");
        location2.setLongitude("10.0183");
        location2.setLatitude("53.5511");
        location2.setCreatedAt(LocalDateTime.now());

        locationRepo.saveAll(Arrays.asList(location1, location2));

        // Retrieve all locations
        List<Location> allLocations = locationRepo.findAll();

        // Verify the locations list size
        assertTrue(allLocations.size() >= 2); // Check that at least 2 locations are present
    }




}
