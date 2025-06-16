package com.project.warehouse_management_system.BinLocation.Service;

import com.project.warehouse_management_system.BinLocation.Model.BinLocation;
import com.project.warehouse_management_system.BinLocation.Repo.BinLocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BinLocationService {

    @Autowired
    private BinLocationRepo binLocationRepository;

    public List<String> generateBinLocations(List<String> areas, int rows, int bays, int levels, List<String> positions) {
        List<String> binLocations = new ArrayList<>();

        for (String area : areas) {
            for (int row = 1; row <= rows; row++) {
                for (int bay = 1; bay <= bays; bay++) {
                    for (int level = 1; level <= levels; level++) {
                        for (String position : positions) {
                            String binCode = String.format("%s-%02d-%02d-%d-%s", area, row, bay, level, position);
                            binLocations.add(binCode);
                        }
                    }
                }
            }
        }
        return binLocations;
    }

    public void saveBinLocations(List<String> binCodes) {
        List<BinLocation> binLocations = binCodes.stream()
                .map(code -> new BinLocation(code))
                .collect(Collectors.toList());
        binLocationRepository.saveAll(binLocations);
    }

    public List<BinLocation> getAllBinLocations() {
        return binLocationRepository.findAll();
    }
}
